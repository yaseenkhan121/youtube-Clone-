<?php

namespace App\Http\Controllers;

use App\Services\YouTubeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    protected YouTubeService $youtubeService;

    public function __construct(YouTubeService $youtubeService)
    {
        $this->youtubeService = $youtubeService;
    }

    /**
     * GET /api/channels/{id}
     */
    public function show(string $id): JsonResponse
    {
        try {
            $channel = $this->youtubeService->getChannelDetails($id);
            return response()->json([
                'success' => true,
                'data' => $channel
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Channel not found or API error.'
            ], 404);
        }
    }

    /**
     * GET /api/channels/{id}/videos
     */
    public function videos(string $id): JsonResponse
    {
        try {
            // We need a method in YouTubeService to fetch channel videos
            $videos = $this->youtubeService->getChannelVideos($id);
            return response()->json([
                'success' => true,
                'data' => $videos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not fetch channel videos.'
            ], 500);
        }
    }
}
