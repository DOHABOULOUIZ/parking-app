<?php

namespace Database\Factories;

use App\Models\Place;
use App\Models\Sector;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlaceFactory extends Factory
{
    protected $model = Place::class;

    public function definition(): array
    {
        return [
            'sector_id' => Sector::factory(),
            'number' => fake()->bothify('?##'),
            'status' => fake()->randomElement(['available', 'occupied', 'reserved', 'maintenance']),
        ];
    }
}
