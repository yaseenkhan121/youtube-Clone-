<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikedVideo extends Model
{
    use HasFactory;

    protected $table = 'liked_videos';

    protected $fillable = [
        'user_id',
        'video_id',
        'title',
        'thumbnail',
        'channel_title',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
