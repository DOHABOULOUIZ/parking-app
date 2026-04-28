<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytic extends Model
{
    protected $fillable = [
        'metric_type',
        'period_type',
        'value',
        'metadata',
        'date',
    ];

    protected $casts = [
        'metadata' => 'array',
        'date' => 'date',
        'value' => 'decimal:2',
    ];

    /**
     * Scopes for common queries
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('metric_type', $type);
    }

    public function scopeForPeriod($query, $startDate, $endDate = null)
    {
        $query->where('date', '>=', $startDate);
        
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }
        
        return $query;
    }
}
