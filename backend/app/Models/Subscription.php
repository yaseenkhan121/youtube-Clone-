<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'channel_id',
        'channel_title',
        'channel_thumbnail',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
