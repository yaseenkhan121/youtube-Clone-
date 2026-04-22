<?php

namespace App\Http\Controllers;

use App\Services\YouTubeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    protected YouTubeService $youtubeService;

    public function __construct(YouTubeService $youtubeService)
    {
        $this->youtubeService = $youtubeService;
    }

    /**
     * GET /api/videos/trending
     */
    public function trending(Request $request): JsonResponse
    {
        try {
            $videos = $this->youtubeService->getTrendingVideos();
            return response()->json([
                'success' => true,
                'data' => $videos,
                'meta' => ['total' => count($videos), 'cached' => true]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/videos/{id}
     */
    public function show(string $id): JsonResponse
    {
        try {
            $video = $this->youtubeService->getVideoById($id);
            
            // Check interactions if logged in
            $isSubscribed = false;
            $isLiked = false;
            $isSaved = false;
            
            $user = auth('sanctum')->user();
            if ($user) {
                if (!empty($video['channelId'])) {
                    $isSubscribed = $user->subscriptions()->where('channel_id', $video['channelId'])->exists();
                }
                $isLiked = $user->likedVideos()->where('video_id', $id)->exists();
                $isSaved = $user->watchLater()->where('video_id', $id)->exists();
            }

            return response()->json([
                'success' => true,
                'data' => $video,
                'isSubscribed' => $isSubscribed,
                'isLiked' => $isLiked,
                'isSaved' => $isSaved,
            ]);
        } catch (\App\Exceptions\VideoNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Video not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/videos/related/{id}
     */
    public function related(string $id): JsonResponse
    {
        try {
            $videos = $this->youtubeService->getSuggestedVideos($id);
            return response()->json(['success' => true, 'data' => $videos]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

}
