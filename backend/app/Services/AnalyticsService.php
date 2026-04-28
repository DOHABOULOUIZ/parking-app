<?php

namespace App\Services;

use App\Models\Analytic;
use App\Models\Reservation;
use App\Models\Place;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Generate daily analytics for a specific date
     */
    public function generateDailyAnalytics(Carbon $date): void
    {
        $startOfDay = $date->copy()->startOfDay();
        $endOfDay = $date->copy()->endOfDay();

        // 1. Occupation Rate
        $totalPlaces = Place::count();
        $occupiedHours = Reservation::whereIn('status', ['reserved', 'parked', 'finished'])
            ->whereBetween('start_time', [$startOfDay, $endOfDay])
            ->get()
            ->sum(function ($reservation) use ($startOfDay, $endOfDay) {
                $start = max($reservation->start_time, $startOfDay);
                $end = min($reservation->end_time ?? now(), $endOfDay);
                return $start->diffInHours($end);
            });

        $occupationRate = $totalPlaces > 0 
            ? ($occupiedHours / ($totalPlaces * 24)) * 100 
            : 0;

        Analytic::updateOrCreate(
            [
                'metric_type' => 'occupation_rate',
                'period_type' => 'daily',
                'date' => $date->toDateString(),
            ],
            [
                'value' => round($occupationRate, 2),
                'metadata' => [
                    'total_places' => $totalPlaces,
                    'occupied_hours' => $occupiedHours,
                ],
            ]
        );

        // 2. Revenue
        $dailyRevenue = Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startOfDay, $endOfDay])
            ->sum('amount');

        Analytic::updateOrCreate(
            [
                'metric_type' => 'revenue',
                'period_type' => 'daily',
                'date' => $date->toDateString(),
            ],
            [
                'value' => $dailyRevenue,
                'metadata' => [
                    'currency' => 'EUR',
                ],
            ]
        );

        // 3. Average parking duration
        $avgDuration = Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startOfDay, $endOfDay])
            ->get()
            ->avg(function ($reservation) {
                return $reservation->start_time->diffInHours($reservation->end_time);
            });

        Analytic::updateOrCreate(
            [
                'metric_type' => 'avg_duration',
                'period_type' => 'daily',
                'date' => $date->toDateString(),
            ],
            [
                'value' => round($avgDuration ?? 0, 2),
                'metadata' => [
                    'unit' => 'hours',
                ],
            ]
        );

        // 4. Reservation count
        $reservationCount = Reservation::whereBetween('created_at', [$startOfDay, $endOfDay])
            ->count();

        Analytic::updateOrCreate(
            [
                'metric_type' => 'reservations_count',
                'period_type' => 'daily',
                'date' => $date->toDateString(),
            ],
            [
                'value' => $reservationCount,
            ]
        );

        // 5. Cancellation rate
        $totalReservations = Reservation::whereBetween('created_at', [$startOfDay, $endOfDay])->count();
        $cancelledReservations = Reservation::where('status', 'cancelled')
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->count();

        $cancellationRate = $totalReservations > 0 
            ? ($cancelledReservations / $totalReservations) * 100 
            : 0;

        Analytic::updateOrCreate(
            [
                'metric_type' => 'cancellation_rate',
                'period_type' => 'daily',
                'date' => $date->toDateString(),
            ],
            [
                'value' => round($cancellationRate, 2),
                'metadata' => [
                    'total' => $totalReservations,
                    'cancelled' => $cancelledReservations,
                ],
            ]
        );
    }

    /**
     * Get analytics for a date range
     */
    public function getAnalytics(string $metricType, Carbon $startDate, Carbon $endDate, string $periodType = 'daily')
    {
        return Analytic::ofType($metricType)
            ->where('period_type', $periodType)
            ->forPeriod($startDate, $endDate)
            ->orderBy('date')
            ->get();
    }

    /**
     * Get dashboard summary
     */
    public function getDashboardSummary(): array
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $last30Days = Carbon::today()->subDays(30);

        return [
            'today' => [
                'occupation_rate' => $this->getMetric('occupation_rate', $today),
                'revenue' => $this->getMetric('revenue', $today),
                'reservations' => $this->getMetric('reservations_count', $today),
            ],
            'yesterday' => [
                'occupation_rate' => $this->getMetric('occupation_rate', $yesterday),
                'revenue' => $this->getMetric('revenue', $yesterday),
            ],
            'last_30_days' => [
                'total_revenue' => Analytic::ofType('revenue')
                    ->forPeriod($last30Days, $today)
                    ->sum('value'),
                'avg_occupation' => Analytic::ofType('occupation_rate')
                    ->forPeriod($last30Days, $today)
                    ->avg('value'),
                'total_reservations' => Analytic::ofType('reservations_count')
                    ->forPeriod($last30Days, $today)
                    ->sum('value'),
            ],
        ];
    }

    /**
     * Get a specific metric for a date
     */
    private function getMetric(string $type, Carbon $date)
    {
        $analytic = Analytic::ofType($type)
            ->where('date', $date->toDateString())
            ->first();

        return $analytic ? $analytic->value : 0;
    }

    /**
     * Get peak hours analysis
     */
    public function getPeakHours($period = 'week'): array
    {
        // If period is a string, parse it to dates
        if (is_string($period)) {
            [$startDate, $endDate] = $this->parsePeriod($period);
        } else {
            // Backwards compatibility: if Carbon objects are passed
            $startDate = $period;
            $endDate = func_get_arg(1);
        }
        
        $reservations = Reservation::whereIn('status', ['reserved', 'parked', 'finished'])
            ->whereBetween('start_time', [$startDate, $endDate])
            ->get();

        $hourlyCount = array_fill(0, 24, 0);

        foreach ($reservations as $reservation) {
            $hour = $reservation->start_time->hour;
            $hourlyCount[$hour]++;
        }

        return $hourlyCount;
    }

    /**
     * Get sector performance
     */
    public function getSectorPerformance(Carbon $startDate, Carbon $endDate): array
    {
        return Place::with('sector')
            ->withCount([
                'reservations' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }
            ])
            ->get()
            ->groupBy('sector.name')
            ->map(function ($places) {
                return [
                    'total_places' => $places->count(),
                    'total_reservations' => $places->sum('reservations_count'),
                    'avg_reservations_per_place' => round($places->avg('reservations_count'), 2),
                ];
            })
            ->toArray();
    }

    /**
     * Get occupancy rate for a period
     */
    public function getOccupancyRate(string $period = 'today'): float
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        $totalPlaces = Place::count();
        $occupiedHours = Reservation::whereIn('status', ['reserved', 'parked', 'finished'])
            ->whereBetween('start_time', [$startDate, $endDate])
            ->get()
            ->sum(function ($reservation) use ($startDate, $endDate) {
                $start = max($reservation->start_time, $startDate);
                $end = min($reservation->end_time ?? now(), $endDate);
                return $start->diffInHours($end);
            });

        $hoursInPeriod = $startDate->diffInHours($endDate);
        return $totalPlaces > 0 && $hoursInPeriod > 0
            ? round(($occupiedHours / ($totalPlaces * $hoursInPeriod)) * 100, 2)
            : 0;
    }

    /**
     * Get revenue for a period
     */
    public function getRevenue(string $period = 'today'): float
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        return Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startDate, $endDate])
            ->sum('amount');
    }

    /**
     * Get average duration for a period
     */
    public function getAverageDuration(string $period = 'today'): float
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        $avgDuration = Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startDate, $endDate])
            ->get()
            ->avg(function ($reservation) {
                return $reservation->start_time->diffInHours($reservation->end_time);
            });

        return round($avgDuration ?? 0, 2);
    }

    /**
     * Get popular sectors for a period
     */
    public function getPopularSectors(string $period = 'today'): array
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        return DB::table('reservations')
            ->join('places', 'reservations.place_id', '=', 'places.id')
            ->join('sectors', 'places.sector_id', '=', 'sectors.id')
            ->whereBetween('reservations.created_at', [$startDate, $endDate])
            ->select('sectors.name', DB::raw('COUNT(*) as reservation_count'))
            ->groupBy('sectors.id', 'sectors.name')
            ->orderByDesc('reservation_count')
            ->limit(5)
            ->get()
            ->toArray();
    }

    /**
     * Get user statistics for a period
     */
    public function getUserStatistics(string $period = 'today'): array
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        return [
            'total_users' => DB::table('users')->count(),
            'active_users' => DB::table('reservations')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->distinct('user_id')
                ->count('user_id'),
            'new_users' => DB::table('users')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
        ];
    }

    /**
     * Get occupancy trend over days
     */
    public function getOccupancyTrend(int $days = 7): array
    {
        $data = [];
        $startDate = Carbon::today()->subDays($days);
        
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $data[] = [
                'date' => $date->toDateString(),
                'rate' => $this->getOccupancyRate($date->toDateString()),
            ];
        }
        
        return $data;
    }

    /**
     * Get revenue trend over days
     */
    public function getRevenueTrend(int $days = 7): array
    {
        $data = [];
        $startDate = Carbon::today()->subDays($days);
        
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $data[] = [
                'date' => $date->toDateString(),
                'revenue' => $this->getRevenue($date->toDateString()),
            ];
        }
        
        return $data;
    }

    /**
     * Compare sectors performance
     */
    public function compareSectors(): array
    {
        return DB::table('sectors')
            ->leftJoin('places', 'sectors.id', '=', 'places.sector_id')
            ->leftJoin('reservations', 'places.id', '=', 'reservations.place_id')
            ->select(
                'sectors.id',
                'sectors.name',
                DB::raw('COUNT(DISTINCT places.id) as total_places'),
                DB::raw('COUNT(reservations.id) as total_reservations'),
                DB::raw('COALESCE(SUM(reservations.amount), 0) as total_revenue')
            )
            ->groupBy('sectors.id', 'sectors.name')
            ->get()
            ->toArray();
    }

    /**
     * Generate comprehensive report
     */
    public function generateReport(string $startDate, string $endDate, string $format = 'json'): array
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        
        return [
            'period' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
            'summary' => [
                'occupancy_rate' => $this->getOccupancyRate("$startDate to $endDate"),
                'total_revenue' => Reservation::where('status', 'finished')
                    ->whereBetween('end_time', [$start, $end])
                    ->sum('amount'),
                'total_reservations' => Reservation::whereBetween('created_at', [$start, $end])->count(),
                'avg_duration' => $this->getAverageDuration("$startDate to $endDate"),
            ],
            'sectors' => $this->compareSectors(),
            'users' => $this->getUserStatistics("$startDate to $endDate"),
        ];
    }

    /**
     * Get cancellation rate for a period
     */
    public function getCancellationRate(string $period = 'today'): float
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        $totalReservations = Reservation::whereBetween('created_at', [$startDate, $endDate])->count();
        $cancelledReservations = Reservation::where('status', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return $totalReservations > 0 
            ? round(($cancelledReservations / $totalReservations) * 100, 2)
            : 0;
    }

    /**
     * Get average revenue per reservation
     */
    public function getAverageRevenuePerReservation(string $period = 'today'): float
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        $totalRevenue = Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startDate, $endDate])
            ->sum('amount');

        $totalReservations = Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startDate, $endDate])
            ->count();

        return $totalReservations > 0 
            ? round($totalRevenue / $totalReservations, 2)
            : 0;
    }

    /**
     * Get no-show rate (reserved but not parked/finished)
     */
    public function getNoShowRate(string $period = 'today'): float
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        $totalReservations = Reservation::whereBetween('created_at', [$startDate, $endDate])->count();
        $noShows = Reservation::where('status', 'reserved')
            ->where('start_time', '<', now())
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return $totalReservations > 0 
            ? round(($noShows / $totalReservations) * 100, 2)
            : 0;
    }

    /**
     * Get cancellation trend over days
     */
    public function getCancellationTrend(int $days = 7): array
    {
        $data = [];
        $startDate = Carbon::today()->subDays($days);
        
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $data[] = [
                'date' => $date->toDateString(),
                'rate' => $this->getCancellationRate($date->toDateString()),
            ];
        }
        
        return $data;
    }

    /**
     * Get top users by reservations
     */
    public function getTopUsers(int $limit = 5, string $period = 'month'): array
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        return DB::table('reservations')
            ->join('users', 'reservations.user_id', '=', 'users.id')
            ->whereBetween('reservations.created_at', [$startDate, $endDate])
            ->where('users.role', '!=', 'admin')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COUNT(reservations.id) as total_reservations'),
                DB::raw('COALESCE(SUM(reservations.amount), 0) as total_spent')
            )
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('total_reservations')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get revenue per place analysis
     */
    public function getRevenuePerPlace(string $period = 'month'): array
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        return DB::table('reservations')
            ->join('places', 'reservations.place_id', '=', 'places.id')
            ->join('sectors', 'places.sector_id', '=', 'sectors.id')
            ->where('reservations.status', 'finished')
            ->whereBetween('reservations.end_time', [$startDate, $endDate])
            ->select(
                'places.id',
                'sectors.name as sector_name',
                DB::raw('COUNT(reservations.id) as total_reservations'),
                DB::raw('COALESCE(SUM(reservations.amount), 0) as total_revenue'),
                DB::raw('COALESCE(AVG(reservations.amount), 0) as avg_revenue')
            )
            ->groupBy('places.id', 'sectors.name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get duration distribution
     */
    public function getDurationDistribution(string $period = 'month'): array
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        
        $reservations = Reservation::where('status', 'finished')
            ->whereBetween('end_time', [$startDate, $endDate])
            ->get();

        $distribution = [
            '0-1h' => 0,
            '1-2h' => 0,
            '2-4h' => 0,
            '4-8h' => 0,
            '8h+' => 0,
        ];

        foreach ($reservations as $reservation) {
            $duration = $reservation->start_time->diffInHours($reservation->end_time);
            
            if ($duration < 1) $distribution['0-1h']++;
            elseif ($duration < 2) $distribution['1-2h']++;
            elseif ($duration < 4) $distribution['2-4h']++;
            elseif ($duration < 8) $distribution['4-8h']++;
            else $distribution['8h+']++;
        }

        return array_map(function ($key, $value) use ($reservations) {
            $total = $reservations->count();
            return [
                'range' => $key,
                'count' => $value,
                'percentage' => $total > 0 ? round(($value / $total) * 100, 2) : 0,
            ];
        }, array_keys($distribution), array_values($distribution));
    }

    /**
     * Get hourly occupancy rate (for heat map)
     */
    public function getHourlyOccupancyRate(string $period = 'week'): array
    {
        [$startDate, $endDate] = $this->parsePeriod($period);
        $days = $startDate->diffInDays($endDate) + 1;
        
        $totalPlaces = Place::count();
        $data = array_fill(0, 24, ['hour' => 0, 'occupancy' => 0]);

        for ($hour = 0; $hour < 24; $hour++) {
            $occupiedCount = 0;
            
            for ($day = 0; $day < $days; $day++) {
                $date = $startDate->copy()->addDays($day);
                $hourStart = $date->copy()->setHour($hour)->startOfHour();
                $hourEnd = $date->copy()->setHour($hour)->endOfHour();

                $occupiedCount += Reservation::whereIn('status', ['reserved', 'parked', 'finished'])
                    ->where(function ($query) use ($hourStart, $hourEnd) {
                        $query->whereBetween('start_time', [$hourStart, $hourEnd])
                            ->orWhereBetween('end_time', [$hourStart, $hourEnd])
                            ->orWhere(function ($q) use ($hourStart, $hourEnd) {
                                $q->where('start_time', '<=', $hourStart)
                                    ->where('end_time', '>=', $hourEnd);
                            });
                    })
                    ->count();
            }

            $data[$hour] = [
                'hour' => str_pad($hour, 2, '0', STR_PAD_LEFT),
                'occupancy' => $totalPlaces > 0 ? round(($occupiedCount / ($totalPlaces * $days)) * 100, 2) : 0,
            ];
        }

        return $data;
    }

    /**
     * Get complete dashboard statistics
     */
    public function getCompleteDashboardStats(string $period = 'week'): array
    {
        return [
            'occupancy_rate' => $this->getOccupancyRate($period),
            'revenue' => $this->getRevenue($period),
            'average_duration' => $this->getAverageDuration($period),
            'average_revenue_per_reservation' => $this->getAverageRevenuePerReservation($period),
            'cancellation_rate' => $this->getCancellationRate($period),
            'no_show_rate' => $this->getNoShowRate($period),
            'popular_sectors' => $this->getPopularSectors($period),
            'peak_hours' => $this->getPeakHours($period),
            'user_statistics' => $this->getUserStatistics($period),
            'top_users' => $this->getTopUsers(5, $period),
            'revenue_per_place' => $this->getRevenuePerPlace($period),
            'duration_distribution' => $this->getDurationDistribution($period),
            'hourly_occupancy' => $this->getHourlyOccupancyRate($period),
        ];
    }

    /**
     * Parse period string to Carbon dates
     */
    private function parsePeriod(string $period): array
    {
        $today = Carbon::today();
        
        return match($period) {
            'today' => [$today->copy()->startOfDay(), $today->copy()->endOfDay()],
            'yesterday' => [Carbon::yesterday()->startOfDay(), Carbon::yesterday()->endOfDay()],
            'week' => [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()],
            'month' => [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()],
            'year' => [$today->copy()->startOfYear(), $today->copy()->endOfYear()],
            default => str_contains($period, ' to ') 
                ? [Carbon::parse(explode(' to ', $period)[0]), Carbon::parse(explode(' to ', $period)[1])]
                : [Carbon::parse($period)->startOfDay(), Carbon::parse($period)->endOfDay()],
        };
    }
}
