<?php

namespace App\Http\Controllers;

use App\Services\YouTubeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * SearchController handles movie/video search queries 
 * by interfacing with the YouTubeService.
 */
class SearchController extends Controller
{
    protected YouTubeService $youtubeService;

    public function __construct(YouTubeService $youtubeService)
    {
        $this->youtubeService = $youtubeService;
    }

    /**
     * Search for videos based on query string.
     * 
     * GET /api/search?q={query}
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        // 1. Validation
        $query = $request->input('q', '');
        
        if (empty(trim($query))) {
            return response()->json([
                'success' => false,
                'message' => 'Search query cannot be empty.'
            ], 422);
        }

        try {
            // 2. Fetch data from Service Layer
            $videos = $this->youtubeService->searchVideos($query);

            // 3. Return Standardized Response
            return response()->json([
                'success' => true,
                'data' => $videos,
                'meta' => [
                    'query' => $query,
                    'count' => count($videos),
                    'timestamp' => now()->toIso8601String()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Search Error: " . $e->getMessage(), [
                'query' => $query,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your search. Please try again later.'
            ], 500);
        }
    }
}
