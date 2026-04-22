<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = ['user_id', 'video_id', 'created_at'];

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}
