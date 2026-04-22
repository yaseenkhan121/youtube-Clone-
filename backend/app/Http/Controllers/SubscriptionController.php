<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Notifications\WowTubeNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * POST /api/subscriptions
     * Body: { channel_id, channel_title, channel_thumbnail }
     */
    public function toggle(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) return response()->json(['success' => false], 401);

        $channelId = $request->input('channel_id');
        
        $sub = Subscription::where('user_id', $user->id)
            ->where('channel_id', $channelId)
            ->first();

        if ($sub) {
            $sub->delete();
            return response()->json([
                'success' => true,
                'subscribed' => false,
                'channel_id' => $channelId
            ]);
        }

        Subscription::create([
            'user_id' => $user->id,
            'channel_id' => $channelId,
            'channel_title' => $request->input('channel_title'),
            'channel_thumbnail' => $request->input('channel_thumbnail'),
        ]);

        $user->notify(new WowTubeNotification("You subscribed to {$request->input('channel_title')}", 'subscription'));

        return response()->json([
            'success' => true,
            'subscribed' => true,
            'channel_id' => $channelId
        ]);
    }

    /**
     * GET /api/subscriptions
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $subs = $user->subscriptions()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $subs
        ]);
    }

    /**
     * GET /api/subscriptions/{channelId}/status
     */
    public function status(string $channelId): JsonResponse
    {
        $user = auth()->user();
        $subscribed = $user ? $user->subscriptions()->where('channel_id', $channelId)->exists() : false;

        return response()->json([
            'success' => true,
            'subscribed' => $subscribed
        ]);
    }
}
