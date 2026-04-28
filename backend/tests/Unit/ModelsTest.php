DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lara_12_react_19_parking_app
DB_USERNAME=root
DB_PASSWORD=           # ← Votre mot de passe MySQL (vide par défaut sur XAMPP)cd backend

# Réinitialiser la base avec données de test
php artisan migrate:fresh --seed<?php

use App\Models\User;
use App\Models\Sector;
use App\Models\Place;

test('user model has correct attributes', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => 'user',
    ]);

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->role)->toBe('user');
    expect($user->isAdmin())->toBeFalse();
});

test('admin user is correctly identified', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    
    expect($admin->isAdmin())->toBeTrue();
});

test('sector has many places relationship', function () {
    $sector = Sector::factory()->create();
    $places = Place::factory()->count(3)->create(['sector_id' => $sector->id]);

    expect($sector->places)->toHaveCount(3);
    expect($sector->places->first())->toBeInstanceOf(Place::class);
});

test('place belongs to sector', function () {
    $sector = Sector::factory()->create(['name' => 'Test Sector']);
    $place = Place::factory()->create(['sector_id' => $sector->id]);

    expect($place->sector->name)->toBe('Test Sector');
});

test('reservation calculates total price correctly', function () {
    $sector = Sector::factory()->create(['price_per_hour' => 2.5]);
    $place = Place::factory()->create(['sector_id' => $sector->id]);
    
    $reservation = \App\Models\Reservation::factory()->create([
        'place_id' => $place->id,
        'start_time' => now(),
        'end_time' => now()->addHours(4),
    ]);

    // 4 hours * 2.5€ = 10€
    expect($reservation->total_price)->toBe(10.0);
});

test('place status can be updated', function () {
    $place = Place::factory()->create(['status' => 'available']);
    
    $place->update(['status' => 'occupied']);
    
    expect($place->fresh()->status)->toBe('occupied');
});
