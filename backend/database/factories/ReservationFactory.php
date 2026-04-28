<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Place;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('now', '+1 week');
        $endTime = (clone $startTime)->modify('+' . fake()->numberBetween(1, 8) . ' hours');

        return [
            'user_id' => User::factory(),
            'place_id' => Place::factory(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'total_price' => fake()->randomFloat(2, 5, 50),
            'status' => fake()->randomElement(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
        ];
    }
}
