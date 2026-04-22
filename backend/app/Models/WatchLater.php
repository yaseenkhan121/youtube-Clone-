<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WatchLater extends Model
{
    use HasFactory;

    protected $table = 'watch_later';

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
