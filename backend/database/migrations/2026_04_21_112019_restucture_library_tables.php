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
        // History
        Schema::rename('watch_history', 'video_history');
        Schema::table('video_history', function (Blueprint $table) {
            $table->string('title')->after('video_id')->nullable();
            $table->string('thumbnail')->after('title')->nullable();
            $table->timestamp('watched_at')->useCurrent()->after('thumbnail');
        });

        // Watch Later
        Schema::table('watch_later', function (Blueprint $table) {
            $table->string('title')->after('video_id')->nullable();
            $table->string('thumbnail')->after('title')->nullable();
        });

        // Likes
        Schema::rename('likes', 'liked_videos');
        Schema::table('liked_videos', function (Blueprint $table) {
            $table->string('title')->after('video_id')->nullable();
            $table->string('thumbnail')->after('title')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('liked_videos', function (Blueprint $table) {
            $table->dropColumn(['title', 'thumbnail']);
        });
        Schema::rename('liked_videos', 'likes');

        Schema::table('watch_later', function (Blueprint $table) {
            $table->dropColumn(['title', 'thumbnail']);
        });

        Schema::table('video_history', function (Blueprint $table) {
            $table->dropColumn(['title', 'thumbnail', 'watched_at']);
        });
        Schema::rename('video_history', 'watch_history');
    }
};
