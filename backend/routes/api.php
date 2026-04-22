<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\LikedVideoController;
use App\Http\Controllers\WatchLaterController;
use App\Http\Controllers\WatchHistoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ChannelController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication (Public)
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// Public Video & Search API
Route::prefix('videos')->group(function() {
    Route::get('trending',      [VideoController::class, 'trending']); 
    Route::get('search',        [SearchController::class, 'search']);
    Route::get('related/{id}',  [VideoController::class, 'related']);
    Route::get('{id}',          [VideoController::class, 'show']);
});

// Channel API
Route::get('channels/{id}',        [ChannelController::class, 'show']);
Route::get('channels/{id}/videos', [ChannelController::class, 'videos']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function() {
    // Auth Actions
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user',    [AuthController::class, 'me']); // Standardized to /api/user

    // Profile
    Route::prefix('profile')->group(function() {
        Route::get('stats',      [ProfileController::class, 'stats']);
        Route::post('update',    [ProfileController::class, 'update']);
        Route::post('avatar',    [ProfileController::class, 'uploadAvatar']);
    });

    // Interactions
    Route::post('subscriptions',                     [SubscriptionController::class, 'toggle']);
    Route::get('subscriptions',                      [SubscriptionController::class, 'index']);
    Route::get('subscriptions/{channelId}/status',   [SubscriptionController::class, 'status']);

    Route::post('liked-videos',                      [LikedVideoController::class, 'toggle']);
    Route::get('liked-videos',                       [LikedVideoController::class, 'index']);
    Route::get('liked-videos/{videoId}/status',      [LikedVideoController::class, 'status']);

    Route::post('watch-later',                       [WatchLaterController::class, 'toggle']);
    Route::get('watch-later',                        [WatchLaterController::class, 'index']);
    Route::get('watch-later/{videoId}/status',       [WatchLaterController::class, 'status']);

    Route::post('history',                           [WatchHistoryController::class, 'store']);
    Route::get('history',                            [WatchHistoryController::class, 'index']);
    Route::delete('history/{videoId}',               [WatchHistoryController::class, 'destroy']);
    Route::delete('history',                         [WatchHistoryController::class, 'clear']);

    // Notifications
    Route::get('notifications',                      [NotificationController::class, 'index']);
    Route::post('notifications/{id}/read',           [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-read',       [NotificationController::class, 'markAllAsRead']);
});
