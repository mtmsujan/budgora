<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    protected $fillable = [
        'user_id',
        'currency',
        'date_format',
        'time_format',
        'first_day_of_week',
        'notifications_enabled',
        'language',
    ];

    protected $casts = [
        'notifications_enabled' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
