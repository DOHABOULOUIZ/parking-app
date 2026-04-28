<?php

namespace Database\Factories;

use App\Models\Sector;
use Illuminate\Database\Eloquent\Factories\Factory;

class SectorFactory extends Factory
{
    protected $model = Sector::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Secteur A', 'Secteur B', 'Secteur C', 'VIP']),
            'description' => fake()->sentence(),
            'total_places' => fake()->numberBetween(20, 100),
            'price_per_hour' => fake()->randomFloat(2, 1.5, 5.0),
        ];
    }
}
