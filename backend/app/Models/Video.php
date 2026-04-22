<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'youtube_video_id',
        'title',
        'description',
        'thumbnail',
        'channel',
        'channel_id',
        'views',
        'duration',
        'published_at',
        'cached_at',
    ];

    protected $casts = [
        'views' => 'integer',
        'published_at' => 'datetime',
        'cached_at' => 'datetime',
    ];

    public function watchHistories()
    {
        return $this->hasMany(WatchHistory::class);
    }
}
