<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CachedVideo extends Model
{
    use HasFactory;

    protected $table = 'cached_videos';

    protected $fillable = [
        'youtube_video_id',
        'title',
        'description',
        'thumbnail',
        'channel_title',
        'channel_id',
        'view_count',
        'like_count',
        'duration',
        'published_at',
        'cached_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'cached_at' => 'datetime',
    ];

    public $timestamps = true;
}
