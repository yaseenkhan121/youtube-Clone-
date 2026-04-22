<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('youtube_video_id')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('channel');
            $table->string('channel_id')->nullable();
            $table->bigInteger('views')->nullable();
            $table->string('duration')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('cached_at')->nullable();
            $table->timestamps();

            $table->index('youtube_video_id');
            $table->index('cached_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
