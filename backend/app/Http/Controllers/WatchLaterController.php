<?php

namespace App\Http\Controllers;

use App\Models\WatchLater;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WatchLaterController extends Controller
{
    /**
     * POST /api/watch-later
     */
    public function toggle(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);

        $videoId = $request->input('video_id');
        
        $item = WatchLater::where('user_id', $user->id)
            ->where('video_id', $videoId)
            ->first();

        if ($item) {
            $item->delete();
            return response()->json([
                'success' => true,
                'saved' => false,
                'video_id' => $videoId
            ]);
        }

        WatchLater::create([
            'user_id' => $user->id,
            'video_id' => $videoId,
            'title' => $request->input('title'),
            'thumbnail' => $request->input('thumbnail'),
            'channel_title' => $request->input('channel_title'),
        ]);

        return response()->json([
            'success' => true,
            'saved' => true,
            'video_id' => $videoId
        ]);
    }

    /**
     * GET /api/watch-later
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $saved = $user->watchLater()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $saved
        ]);
    }

    /**
     * GET /api/watch-later/{videoId}/status
     */
    public function status(string $videoId): JsonResponse
    {
        $user = auth()->user();
        $saved = $user ? $user->watchLater()->where('video_id', $videoId)->exists() : false;

        return response()->json([
            'success' => true,
            'saved' => $saved
        ]);
    }
}
