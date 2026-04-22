<?php

namespace App\Services;

use App\Exceptions\YouTubeApiException;
use App\Exceptions\QuotaExceededException;
use App\Exceptions\VideoNotFoundException;
use App\Models\CachedVideo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YouTubeService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://www.googleapis.com/youtube/v3';

    public function __construct()
    {
        $this->apiKey = config('services.youtube.api_key');
    }

    /**
     * Fetch trending/popular videos
     */
    public function getTrendingVideos(string $regionCode = 'US', ?string $categoryId = null): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/videos", [
                'part' => 'snippet,statistics,contentDetails',
                'chart' => 'mostPopular',
                'regionCode' => $regionCode,
                'videoCategoryId' => $categoryId,
                'maxResults' => 24,
                'key' => $this->apiKey,
            ]);

            if ($response->status() === 403) {
                return $this->getFallbackTrending();
            }

            if ($response->failed()) {
                throw new YouTubeApiException('Failed to fetch trending videos');
            }

            $items = $response->json()['items'] ?? [];
            $videos = array_map(fn($item) => $this->transformVideo($item), $items);
            
            // Attach channel thumbnails in bulk
            $videos = $this->attachChannelData($videos);

            $this->cacheVideos($videos);

            return $videos;
        } catch (\Exception $e) {
            Log::error('YouTubeService Error: ' . $e->getMessage());
            return $this->getFallbackTrending();
        }
    }

    /**
     * Get single video details
     */
    public function getVideoById(string $videoId): array
    {
        // 1. Check cache first
        $cached = CachedVideo::where('youtube_video_id', $videoId)
            ->where('cached_at', '>', now()->subHour())
            ->first();

        if ($cached) {
            return $this->transformCached($cached);
        }

        try {
            // 2. Fetch video
            $response = Http::get("{$this->baseUrl}/videos", [
                'part' => 'snippet,statistics,contentDetails',
                'id' => $videoId,
                'key' => $this->apiKey,
            ]);

            if ($response->status() === 403) {
                throw new QuotaExceededException('YouTube API quota exceeded');
            }

            if ($response->failed() || empty($response->json()['items'])) {
                throw new VideoNotFoundException('Video not found');
            }

            $item = $response->json()['items'][0];
            $video = $this->transformVideo($item);

            // 3. Fetch channel data (stats & snippet for thumbnail)
            $channelRes = Http::get("{$this->baseUrl}/channels", [
                'part' => 'snippet,statistics',
                'id' => $video['channelId'],
                'key' => $this->apiKey,
            ]);

            if ($channelRes->successful() && !empty($channelRes->json()['items'])) {
                $channelItem = $channelRes->json()['items'][0];
                $chanStats = $channelItem['statistics'] ?? [];
                $chanSnippet = $channelItem['snippet'] ?? [];
                $video['subscriberCount'] = $this->formatCount($chanStats['subscriberCount'] ?? '0');
                $video['channelThumbnail'] = $chanSnippet['thumbnails']['default']['url'] ?? '';
            } else {
                $video['subscriberCount'] = '0';
                $video['channelThumbnail'] = '';
            }

            // 4. Cache
            $this->cacheVideos([$video]);

            return $video;
        } catch (\Exception $e) {
            Log::error('YouTubeService Error: ' . $e->getMessage());
            // Fallback to any cache if exists
            $fallback = CachedVideo::where('youtube_video_id', $videoId)->first();
            if ($fallback) return $this->transformCached($fallback);
            throw $e;
        }
    }

    /**
     * Search videos
     */
    public function searchVideos(string $query, int $maxResults = 24): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/search", [
                'part' => 'snippet',
                'q' => $query,
                'type' => 'video',
                'maxResults' => $maxResults,
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) throw new YouTubeApiException('Search failed');

            $items = $response->json()['items'] ?? [];
            $videoIds = collect($items)->pluck('id.videoId')->filter()->implode(',');

            // Search results don't have stats, fetch full details for those IDs
            if ($videoIds) {
                $detailsRes = Http::get("{$this->baseUrl}/videos", [
                    'part' => 'snippet,statistics,contentDetails',
                    'id' => $videoIds,
                    'key' => $this->apiKey,
                ]);
                
                if ($detailsRes->successful()) {
                    $results = array_map(fn($item) => $this->transformVideo($item), $detailsRes->json()['items'] ?? []);
                    // Attach channel thumbnails
                    $results = $this->attachChannelData($results);
                    $this->cacheVideos($results);
                    return $results;
                }
            }

            return [];
        } catch (\Exception $e) {
            Log::error('YouTubeService Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get suggested videos
     */
    public function getSuggestedVideos(string $videoId): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/search", [
                'part' => 'snippet',
                'relatedToVideoId' => $videoId,
                'type' => 'video',
                'maxResults' => 15,
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) return [];

            $items = $response->json()['items'] ?? [];
            $videoIds = collect($items)->pluck('id.videoId')->filter()->implode(',');

            if ($videoIds) {
                $detailsRes = Http::get("{$this->baseUrl}/videos", [
                    'part' => 'snippet,statistics,contentDetails',
                    'id' => $videoIds,
                    'key' => $this->apiKey,
                ]);
                
                if ($detailsRes->successful()) {
                    $results = array_map(fn($item) => $this->transformVideo($item), $detailsRes->json()['items'] ?? []);
                    return $this->attachChannelData($results);
                }
            }

            return [];
        } catch (\Exception $e) {
            Log::error('YouTubeService Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get channel details
     */
    public function getChannelDetails(string $channelId): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/channels", [
                'part' => 'snippet,statistics,brandingSettings',
                'id' => $channelId,
                'key' => $this->apiKey,
            ]);

            if ($response->failed() || empty($response->json()['items'])) {
                throw new \Exception('Channel not found');
            }

            $item = $response->json()['items'][0];
            $snippet = $item['snippet'];
            $stats = $item['statistics'];
            $branding = $item['brandingSettings'] ?? [];

            return [
                'channelId' => $item['id'],
                'title' => $snippet['title'],
                'description' => $snippet['description'] ?? '',
                'thumbnail' => $snippet['thumbnails']['high']['url'] ?? '',
                'banner' => $branding['image']['bannerExternalUrl'] ?? '',
                'subscriberCount' => $this->formatCount($stats['subscriberCount'] ?? '0'),
                'videoCount' => $this->formatCount($stats['videoCount'] ?? '0'),
                'viewCount' => $this->formatCount($stats['viewCount'] ?? '0'),
                'publishedAt' => $snippet['publishedAt'],
            ];
        } catch (\Exception $e) {
            Log::error('YouTubeService Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get videos for a specific channel
     */
    public function getChannelVideos(string $channelId, int $maxResults = 24): array
    {
        try {
            // Search is the only way to get a list of videos for a channel by channelId
            $response = Http::get("{$this->baseUrl}/search", [
                'part' => 'snippet',
                'channelId' => $channelId,
                'order' => 'date',
                'type' => 'video',
                'maxResults' => $maxResults,
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) throw new \Exception('Search failed');

            $items = $response->json()['items'] ?? [];
            $videoIds = collect($items)->pluck('id.videoId')->filter()->implode(',');

            if ($videoIds) {
                // Fetch full details for these IDs
                $detailsRes = Http::get("{$this->baseUrl}/videos", [
                    'part' => 'snippet,statistics,contentDetails',
                    'id' => $videoIds,
                    'key' => $this->apiKey,
                ]);
                
                if ($detailsRes->successful()) {
                    $results = array_map(fn($item) => $this->transformVideo($item), $detailsRes->json()['items'] ?? []);
                    // Attach channel thumbnails
                    $results = $this->attachChannelData($results);
                    $this->cacheVideos($results);
                    return $results;
                }
            }

            return [];
        } catch (\Exception $e) {
            Log::error('YouTubeService Error: ' . $e->getMessage());
            return [];
        }
    }

    protected function transformVideo(array $item): array
    {
        $snippet = $item['snippet'];
        $stats = $item['statistics'] ?? [];
        $content = $item['contentDetails'] ?? [];

        return [
            'videoId' => $item['id'] ?? ($item['id']['videoId'] ?? ''),
            'title' => $snippet['title'],
            'description' => $snippet['description'] ?? '',
            'thumbnail' => $snippet['thumbnails']['high']['url'] ?? '',
            'channelTitle' => $snippet['channelTitle'],
            'channelId' => $snippet['channelId'],
            'viewCount' => $this->formatCount($stats['viewCount'] ?? '0'),
            'likeCount' => $this->formatCount($stats['likeCount'] ?? '0'),
            'duration' => $this->parseDuration($content['duration'] ?? ''),
            'publishedAt' => $snippet['publishedAt'],
            'rawViewCount' => (int) ($stats['viewCount'] ?? 0),
            'rawLikeCount' => (int) ($stats['likeCount'] ?? 0),
        ];
    }

    protected function transformCached($video): array
    {
        return [
            'videoId' => $video->youtube_video_id,
            'title' => $video->title,
            'description' => $video->description,
            'thumbnail' => $video->thumbnail,
            'channelTitle' => $video->channel_title,
            'channelId' => $video->channel_id,
            'viewCount' => $this->formatCount((string) ($video->view_count ?? 0)),
            'likeCount' => $this->formatCount((string) ($video->like_count ?? 0)),
            'duration' => $video->duration,
            'publishedAt' => $video->published_at?->toISOString(),
            'rawViewCount' => (int) ($video->view_count ?? 0),
            'rawLikeCount' => (int) ($video->like_count ?? 0),
            'subscriberCount' => '0',
        ];
    }

    protected function cacheVideos(array $videos): void
    {
        foreach ($videos as $video) {
            CachedVideo::updateOrCreate(
                ['youtube_video_id' => $video['videoId']],
                [
                    'title' => $video['title'],
                    'description' => $video['description'] ?? '',
                    'thumbnail' => $video['thumbnail'],
                    'channel_title' => $video['channelTitle'],
                    'channel_id' => $video['channelId'],
                    'view_count' => $video['rawViewCount'] ?? 0,
                    'like_count' => $video['rawLikeCount'] ?? 0,
                    'duration' => $video['duration'],
                    'published_at' => Carbon::parse($video['publishedAt']),
                    'cached_at' => now(),
                ]
            );
        }
    }

    protected function getFallbackTrending(): array
    {
        return CachedVideo::orderBy('cached_at', 'desc')
            ->limit(24)
            ->get()
            ->map(fn($video) => $this->transformCached($video))
            ->toArray();
    }

    protected function parseDuration(string $duration): string
    {
        if (empty($duration)) return '';
        try {
            $interval = new \DateInterval($duration);
            return $interval->format('%h:%i:%s');
        } catch (\Exception $e) {
            return '';
        }
    }

    protected function formatCount(string $count): string
    {
        $num = (int) $count;
        if ($num >= 1000000) return round($num / 1000000, 1) . 'M';
        if ($num >= 1000) return round($num / 1000, 1) . 'K';
        return (string) $num;
    }

    /**
     * Attach channel thumbnails in bulk
     */
    protected function attachChannelData(array $videos): array
    {
        if (empty($videos)) return [];

        $channelIds = collect($videos)->pluck('channelId')->filter()->unique()->implode(',');
        
        if (!$channelIds) return $videos;

        try {
            $response = Http::get("{$this->baseUrl}/channels", [
                'part' => 'snippet',
                'id' => $channelIds,
                'key' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $items = $response->json()['items'] ?? [];
                
                if (empty($items)) {
                    Log::warning('attachChannelData: Channels API returned 0 items for IDs: ' . substr($channelIds, 0, 100));
                    return $videos;
                }

                $channels = collect($items)
                    ->keyBy('id')
                    ->map(fn($item) => $item['snippet']['thumbnails']['default']['url'] ?? '');

                return array_map(function($video) use ($channels) {
                    $video['channelThumbnail'] = $channels->get($video['channelId'], '');
                    return $video;
                }, $videos);
            } else {
                Log::warning('attachChannelData: API failed with status ' . $response->status() . ' - ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Failed to attach channel thumbnails: ' . $e->getMessage());
        }

        return $videos;
    }
}
