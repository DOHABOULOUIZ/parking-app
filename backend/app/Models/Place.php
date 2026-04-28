<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Place extends Model
{
    //
    protected $fillable = ['sector_id', 'place_number', 'status'];

    protected $appends = ['number'];

    public function sector():BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    public function reservations():HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get the place number (alias for place_number)
     */
    protected function number(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->place_number,
        );
    }
}
