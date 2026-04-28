<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'place_id',
        'start_time',
        'end_time',
        'status',
        'amount',
        'paid',
        'is_approved',
        'rejection_reason',
        'qr_code_token',
        'vehicle_registration',
        'checked_in_at',
        'checked_out_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'checked_in_at' => 'datetime',
            'checked_out_at' => 'datetime',
        ];
    }

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function place():BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
