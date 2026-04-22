<?php

namespace App\Http\Controllers;

use App\Models\WatchHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class WatchHistoryController extends Controller
{
    /**
     * POST /api/history
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) return response()->json(['success' => false], 401);

        $videoId = $request->input('video_id');

        // Delete existing entry to avoid duplicates
        WatchHistory::where('user_id', $user->id)
            ->where('video_id', $videoId)
            ->delete();

        // New entry
        WatchHistory::create([
            'user_id' => $user->id,
            'video_id' => $videoId,
            'title' => $request->input('title'),
            'thumbnail' => $request->input('thumbnail'),
            'channel_title' => $request->input('channel_title'),
            'watched_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * GET /api/history
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $history = $user->watchHistory()->latest('watched_at')->get();

        $today = [];
        $yesterday = [];
        $thisWeek = [];
        $older = [];

        foreach ($history as $item) {
            $date = Carbon::parse($item->watched_at);
            if ($date->isToday()) {
                $today[] = $item;
            } elseif ($date->isYesterday()) {
                $yesterday[] = $item;
            } elseif ($date->greaterThanOrEqualTo(now()->startOfWeek())) {
                $thisWeek[] = $item;
            } else {
                $older[] = $item;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'today' => $today,
                'yesterday' => $yesterday,
                'this_week' => $thisWeek,
                'older' => $older,
            ]
        ]);
    }

    /**
     * DELETE /api/history/{videoId}
     */
    public function destroy(string $videoId): JsonResponse
    {
        $user = auth()->user();
        WatchHistory::where('user_id', $user->id)->where('video_id', $videoId)->delete();

        return response()->json(['success' => true]);
    }

    /**
     * DELETE /api/history
     */
    public function clear(): JsonResponse
    {
        $user = auth()->user();
        WatchHistory::where('user_id', $user->id)->delete();

        return response()->json(['success' => true]);
    }
}
