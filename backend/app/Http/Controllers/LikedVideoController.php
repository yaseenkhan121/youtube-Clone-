<?php

namespace App\Http\Controllers;

use App\Models\LikedVideo;
use App\Notifications\WowTubeNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikedVideoController extends Controller
{
    /**
     * POST /api/liked-videos
     * Body: { video_id, title, thumbnail, channel_title }
     */
    public function toggle(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);

        $videoId = $request->input('video_id');
        
        $liked = LikedVideo::where('user_id', $user->id)
            ->where('video_id', $videoId)
            ->first();

        if ($liked) {
            $liked->delete();
            return response()->json([
                'success' => true,
                'liked' => false,
                'video_id' => $videoId
            ]);
        }

        LikedVideo::create([
            'user_id' => $user->id,
            'video_id' => $videoId,
            'title' => $request->input('title'),
            'thumbnail' => $request->input('thumbnail'),
            'channel_title' => $request->input('channel_title'),
        ]);

        $user->notify(new WowTubeNotification("You liked '{$request->input('title')}'", 'like'));

        return response()->json([
            'success' => true,
            'liked' => true,
            'video_id' => $videoId
        ]);
    }

    /**
     * GET /api/liked-videos
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $liked = $user->likedVideos()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $liked
        ]);
    }

    /**
     * GET /api/liked-videos/{videoId}/status
     */
    public function status(string $videoId): JsonResponse
    {
        $user = auth()->user();
        $liked = $user ? $user->likedVideos()->where('video_id', $videoId)->exists() : false;

        return response()->json([
            'success' => true,
            'liked' => $liked
        ]);
    }
}
