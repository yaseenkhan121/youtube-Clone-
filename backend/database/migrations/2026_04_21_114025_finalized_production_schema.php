<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Cached Videos
        if (Schema::hasTable('videos')) {
            Schema::rename('videos', 'cached_videos');
        }
        
        Schema::table('cached_videos', function (Blueprint $table) {
            if (Schema::hasColumn('cached_videos', 'channel')) {
                $table->renameColumn('channel', 'channel_title');
            }
            if (Schema::hasColumn('cached_videos', 'views')) {
                $table->renameColumn('views', 'view_count');
            }
            if (!Schema::hasColumn('cached_videos', 'like_count')) {
                $table->string('like_count')->nullable()->after('view_count');
            }
        });

        // 2. Subscriptions
        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn('subscriptions', 'channel_name')) {
                $table->renameColumn('channel_name', 'channel_title');
            }
        });

        // 3. Liked Videos
        if (Schema::hasTable('likes')) {
            Schema::rename('likes', 'liked_videos');
        }
        Schema::table('liked_videos', function (Blueprint $table) {
            if (!Schema::hasColumn('liked_videos', 'channel_title')) {
                $table->string('channel_title')->after('thumbnail')->nullable();
            }
        });

        // 4. Watch Later
        Schema::table('watch_later', function (Blueprint $table) {
            if (!Schema::hasColumn('watch_later', 'channel_title')) {
                $table->string('channel_title')->after('thumbnail')->nullable();
            }
        });

        // 5. Watch History
        if (Schema::hasTable('video_history')) {
            Schema::rename('video_history', 'watch_history');
        }
        Schema::table('watch_history', function (Blueprint $table) {
            if (!Schema::hasColumn('watch_history', 'channel_title')) {
                $table->string('channel_title')->after('thumbnail')->nullable();
            }
            if (Schema::hasColumn('watch_history', 'watched_at')) {
                $table->timestamp('watched_at')->useCurrent()->change();
            } else {
                $table->timestamp('watched_at')->useCurrent()->after('channel_title');
            }
        });
    }

    public function down(): void
    {
        // Simple reversals for down if needed
        Schema::rename('watch_history', 'video_history');
        Schema::rename('liked_videos', 'likes');
        Schema::rename('cached_videos', 'videos');
    }
};
