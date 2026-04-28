<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Place;
use App\Models\Analytic;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class PredictionService
{
    /**
     * Predict occupation rate for a future date
     * Using simple linear regression based on historical data
     */
    public function predictOccupationRate(Carbon $targetDate): array
    {
        // Get historical data (last 90 days)
        $historicalData = Analytic::ofType('occupation_rate')
            ->where('period_type', 'daily')
            ->forPeriod(Carbon::today()->subDays(90), Carbon::today())
            ->orderBy('date')
            ->get();

        if ($historicalData->count() < 7) {
            return [
                'prediction' => null,
                'confidence' => 'low',
                'message' => 'Not enough historical data for prediction',
            ];
        }

        // Simple linear regression
        $prediction = $this->linearRegressionPredict($historicalData, $targetDate);

        // Adjust for day of week (weekends usually have different patterns)
        $dayOfWeekAdjustment = $this->getDayOfWeekAdjustment($targetDate, $historicalData);
        $adjustedPrediction = $prediction * $dayOfWeekAdjustment;

        // Ensure prediction is within realistic bounds (0-100%)
        $adjustedPrediction = max(0, min(100, $adjustedPrediction));

        return [
            'prediction' => round($adjustedPrediction, 2),
            'confidence' => $this->calculateConfidence($historicalData),
            'recommendation' => $this->getRecommendation($adjustedPrediction),
            'historical_avg' => round($historicalData->avg('value'), 2),
        ];
    }

    /**
     * Predict revenue for a future period
     */
    public function predictRevenue(Carbon $targetDate): array
    {
        $historicalData = Analytic::ofType('revenue')
            ->where('period_type', 'daily')
            ->forPeriod(Carbon::today()->subDays(90), Carbon::today())
            ->orderBy('date')
            ->get();

        if ($historicalData->count() < 7) {
            return [
                'prediction' => null,
                'confidence' => 'low',
                'message' => 'Not enough historical data',
            ];
        }

        $prediction = $this->linearRegressionPredict($historicalData, $targetDate);
        $dayOfWeekAdjustment = $this->getDayOfWeekAdjustment($targetDate, $historicalData);
        $adjustedPrediction = max(0, $prediction * $dayOfWeekAdjustment);

        return [
            'prediction' => round($adjustedPrediction, 2),
            'confidence' => $this->calculateConfidence($historicalData),
            'currency' => 'EUR',
        ];
    }

    /**
     * Simple linear regression prediction
     */
    private function linearRegressionPredict(Collection $data, Carbon $targetDate): float
    {
        $n = $data->count();
        $sumX = 0;
        $sumY = 0;
        $sumXY = 0;
        $sumX2 = 0;

        $baseDate = $data->first()->date;

        foreach ($data as $index => $point) {
            $x = $point->date->diffInDays($baseDate);
            $y = $point->value;

            $sumX += $x;
            $sumY += $y;
            $sumXY += ($x * $y);
            $sumX2 += ($x * $x);
        }

        // Calculate slope (m) and intercept (b)
        $m = ($n * $sumXY - $sumX * $sumY) / ($n * $sumX2 - $sumX * $sumX);
        $b = ($sumY - $m * $sumX) / $n;

        // Predict for target date
        $targetX = $targetDate->diffInDays($baseDate);
        return $m * $targetX + $b;
    }

    /**
     * Get day of week adjustment factor
     */
    private function getDayOfWeekAdjustment(Carbon $targetDate, Collection $historicalData): float
    {
        $dayOfWeek = $targetDate->dayOfWeek;

        // Get average for this day of week from historical data
        $sameDayData = $historicalData->filter(function ($point) use ($dayOfWeek) {
            return $point->date->dayOfWeek === $dayOfWeek;
        });

        if ($sameDayData->isEmpty()) {
            return 1.0;
        }

        $overallAvg = $historicalData->avg('value');
        $dayAvg = $sameDayData->avg('value');

        return $overallAvg > 0 ? $dayAvg / $overallAvg : 1.0;
    }

    /**
     * Calculate confidence level
     */
    private function calculateConfidence(Collection $data): string
    {
        $count = $data->count();
        $variance = $this->calculateVariance($data);

        if ($count >= 30 && $variance < 100) {
            return 'high';
        } elseif ($count >= 14 && $variance < 200) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * Calculate variance
     */
    private function calculateVariance(Collection $data): float
    {
        $mean = $data->avg('value');
        $squaredDifferences = $data->map(function ($point) use ($mean) {
            return pow($point->value - $mean, 2);
        });

        return $squaredDifferences->avg();
    }

    /**
     * Get recommendation based on predicted occupation
     */
    private function getRecommendation(float $predictedOccupation): string
    {
        if ($predictedOccupation > 85) {
            return 'High demand expected. Consider dynamic pricing increase.';
        } elseif ($predictedOccupation > 70) {
            return 'Good occupation expected. Normal operations.';
        } elseif ($predictedOccupation > 50) {
            return 'Moderate demand. Consider promotional offers.';
        } else {
            return 'Low demand expected. Implement discount strategies.';
        }
    }

    /**
     * Get best time slots for a date
     */
    public function suggestBestTimeSlots(Carbon $date): array
    {
        // Get historical data for same day of week
        $dayOfWeek = $date->dayOfWeek;
        
        $reservations = Reservation::whereIn('status', ['reserved', 'parked', 'finished'])
            ->whereRaw('DAYOFWEEK(start_time) = ?', [$dayOfWeek + 1])
            ->where('start_time', '>', Carbon::now()->subDays(90))
            ->get();

        $hourlyOccupation = array_fill(0, 24, 0);
        $totalPlaces = Place::count();

        foreach ($reservations as $reservation) {
            $hour = $reservation->start_time->hour;
            $hourlyOccupation[$hour]++;
        }

        // Calculate occupation rate per hour
        $hourlyRates = [];
        foreach ($hourlyOccupation as $hour => $count) {
            $rate = ($count / max($reservations->count(), 1)) * 100;
            $hourlyRates[$hour] = round($rate, 2);
        }

        // Sort by lowest occupation (best availability)
        asort($hourlyRates);

        return [
            'best_hours' => array_slice(array_keys($hourlyRates), 0, 5, true),
            'hourly_rates' => $hourlyRates,
        ];
    }

    /**
     * Predict monthly revenue
     */
    public function predictMonthlyRevenue(int $year, int $month): array
    {
        $daysInMonth = Carbon::create($year, $month)->daysInMonth;
        $predictions = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::create($year, $month, $day);
            if ($date->isFuture()) {
                $prediction = $this->predictRevenue($date);
                $predictions[] = $prediction['prediction'] ?? 0;
            }
        }

        return [
            'total_predicted' => round(array_sum($predictions), 2),
            'daily_average' => round(array_sum($predictions) / max(count($predictions), 1), 2),
            'confidence' => count($predictions) > 0 ? 'medium' : 'low',
        ];
    }

    /**
     * Predict availability for a specific sector and datetime
     */
    public function predictAvailability(int $sectorId, string $datetime): array
    {
        $targetDate = Carbon::parse($datetime);
        $sector = \App\Models\Sector::with('places')->findOrFail($sectorId);
        
        // Get historical occupation for this sector at this time
        $dayOfWeek = $targetDate->dayOfWeek;
        $hour = $targetDate->hour;
        
        $historicalReservations = Reservation::whereHas('place', function ($query) use ($sectorId) {
                $query->where('sector_id', $sectorId);
            })
            ->whereIn('status', ['reserved', 'parked', 'finished'])
            ->whereRaw('DAYOFWEEK(start_time) = ?', [$dayOfWeek + 1])
            ->whereRaw('HOUR(start_time) = ?', [$hour])
            ->where('start_time', '>', Carbon::now()->subDays(90))
            ->count();

        $totalPlaces = $sector->places->count();
        $avgOccupation = $historicalReservations / max($totalPlaces, 1);
        
        $availablePlaces = max(0, $totalPlaces - ceil($avgOccupation));
        
        return [
            'sector_id' => $sectorId,
            'sector_name' => $sector->name,
            'datetime' => $targetDate->toDateTimeString(),
            'total_places' => $totalPlaces,
            'predicted_available' => (int) $availablePlaces,
            'predicted_occupied' => $totalPlaces - $availablePlaces,
            'confidence' => $historicalReservations > 5 ? 'high' : 'medium',
        ];
    }

    /**
     * Recommend best sector based on user preferences
     */
    public function recommendBestSector(string $datetime, ?int $userId = null): array
    {
        $targetDate = Carbon::parse($datetime);
        $sectors = \App\Models\Sector::with('places')->get();
        
        $recommendations = [];
        
        foreach ($sectors as $sector) {
            $availability = $this->predictAvailability($sector->id, $datetime);
            
            // Calculate score based on availability, price, and user history
            $score = $availability['predicted_available'] * 10;
            
            // Adjust for price (lower price = higher score)
            $score += (10 - $sector->price_per_hour) * 5;
            
            // If user provided, adjust based on their history
            if ($userId) {
                $userPreference = Reservation::where('user_id', $userId)
                    ->whereHas('place', function ($query) use ($sector) {
                        $query->where('sector_id', $sector->id);
                    })
                    ->count();
                $score += $userPreference * 3;
            }
            
            $recommendations[] = [
                'sector_id' => $sector->id,
                'sector_name' => $sector->name,
                'score' => $score,
                'price_per_hour' => $sector->price_per_hour,
                'predicted_available' => $availability['predicted_available'],
                'reason' => $this->getRecommendationReason($availability['predicted_available'], $sector->price_per_hour),
            ];
        }
        
        // Sort by score descending
        usort($recommendations, fn($a, $b) => $b['score'] <=> $a['score']);
        
        return [
            'datetime' => $targetDate->toDateTimeString(),
            'recommendations' => $recommendations,
            'best_choice' => $recommendations[0] ?? null,
        ];
    }

    /**
     * Calculate dynamic pricing based on demand
     */
    public function calculateDynamicPrice(int $sectorId, string $datetime): array
    {
        $sector = \App\Models\Sector::findOrFail($sectorId);
        $availability = $this->predictAvailability($sectorId, $datetime);
        
        $basePrice = $sector->price_per_hour;
        $occupationRate = ($availability['predicted_occupied'] / max($availability['total_places'], 1)) * 100;
        
        // Dynamic pricing algorithm
        $multiplier = 1.0;
        
        if ($occupationRate > 90) {
            $multiplier = 1.5; // +50% for very high demand
        } elseif ($occupationRate > 75) {
            $multiplier = 1.3; // +30% for high demand
        } elseif ($occupationRate > 60) {
            $multiplier = 1.15; // +15% for moderate demand
        } elseif ($occupationRate < 30) {
            $multiplier = 0.8; // -20% discount for low demand
        }
        
        // Weekend adjustment
        $targetDate = Carbon::parse($datetime);
        if ($targetDate->isWeekend()) {
            $multiplier *= 1.1; // +10% for weekends
        }
        
        // Peak hours adjustment (7-9 AM, 5-7 PM)
        $hour = $targetDate->hour;
        if (($hour >= 7 && $hour <= 9) || ($hour >= 17 && $hour <= 19)) {
            $multiplier *= 1.2; // +20% for peak hours
        }
        
        $dynamicPrice = round($basePrice * $multiplier, 2);
        
        return [
            'sector_id' => $sectorId,
            'datetime' => $datetime,
            'base_price' => $basePrice,
            'dynamic_price' => $dynamicPrice,
            'multiplier' => round($multiplier, 2),
            'savings' => $dynamicPrice < $basePrice ? round($basePrice - $dynamicPrice, 2) : 0,
            'surcharge' => $dynamicPrice > $basePrice ? round($dynamicPrice - $basePrice, 2) : 0,
            'reason' => $this->getPricingReason($occupationRate, $targetDate),
        ];
    }

    /**
     * Predict peak hours for a specific date
     */
    public function predictPeakHours(string $date): array
    {
        $targetDate = Carbon::parse($date);
        $dayOfWeek = $targetDate->dayOfWeek;
        
        // Get historical data for same day of week
        $reservations = Reservation::whereIn('status', ['reserved', 'parked', 'finished'])
            ->whereRaw('DAYOFWEEK(start_time) = ?', [$dayOfWeek + 1])
            ->where('start_time', '>', Carbon::now()->subDays(90))
            ->get();
        
        $hourlyCount = array_fill(0, 24, 0);
        
        foreach ($reservations as $reservation) {
            $hour = $reservation->start_time->hour;
            $hourlyCount[$hour]++;
        }
        
        // Find peak hours (top 5)
        arsort($hourlyCount);
        $peakHours = array_slice($hourlyCount, 0, 5, true);
        
        return [
            'date' => $targetDate->toDateString(),
            'day_of_week' => $targetDate->format('l'),
            'peak_hours' => array_map(fn($hour, $count) => [
                'hour' => $hour,
                'time_range' => sprintf('%02d:00-%02d:00', $hour, $hour + 1),
                'predicted_reservations' => $count,
            ], array_keys($peakHours), $peakHours),
            'best_time_to_visit' => $this->findBestTimeToVisit($hourlyCount),
        ];
    }

    /**
     * Get recommendation reason
     */
    private function getRecommendationReason(int $available, float $price): string
    {
        if ($available > 10 && $price < 3) {
            return 'Best value: Good availability and competitive price';
        } elseif ($available > 10) {
            return 'High availability expected';
        } elseif ($price < 3) {
            return 'Competitive pricing';
        } else {
            return 'Limited availability, book early';
        }
    }

    /**
     * Get pricing reason
     */
    private function getPricingReason(float $occupationRate, Carbon $date): string
    {
        $reasons = [];
        
        if ($occupationRate > 90) {
            $reasons[] = 'Very high demand';
        } elseif ($occupationRate > 75) {
            $reasons[] = 'High demand';
        } elseif ($occupationRate < 30) {
            $reasons[] = 'Low demand discount';
        }
        
        if ($date->isWeekend()) {
            $reasons[] = 'Weekend premium';
        }
        
        $hour = $date->hour;
        if (($hour >= 7 && $hour <= 9) || ($hour >= 17 && $hour <= 19)) {
            $reasons[] = 'Peak hours';
        }
        
        return implode(', ', $reasons) ?: 'Standard pricing';
    }

    /**
     * Find best time to visit (lowest occupation)
     */
    private function findBestTimeToVisit(array $hourlyCount): array
    {
        asort($hourlyCount);
        $bestHours = array_slice($hourlyCount, 0, 3, true);
        
        return array_map(fn($hour) => [
            'hour' => $hour,
            'time_range' => sprintf('%02d:00-%02d:00', $hour, $hour + 1),
        ], array_keys($bestHours));
    }
}
