<?php

use App\Models\User;
use App\Models\Place;
use App\Models\Sector;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->user = User::factory()->create(['role' => 'user']);
    
    $this->sector = Sector::factory()->create([
        'name' => 'Secteur A',
        'price_per_hour' => 2.5,
    ]);
    
    $this->place = Place::factory()->create([
        'sector_id' => $this->sector->id,
        'number' => 'A1',
        'status' => 'available',
    ]);
});

test('user can create a reservation', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/book/reservation', [
            'place_id' => $this->place->id,
            'start_time' => now()->addHours(1)->toDateTimeString(),
            'end_time' => now()->addHours(3)->toDateTimeString(),
        ]);

    $response->assertStatus(201);
    expect(Reservation::count())->toBe(1);
});

test('user cannot reserve occupied place', function () {
    // Create existing reservation
    Reservation::factory()->create([
        'place_id' => $this->place->id,
        'user_id' => $this->user->id,
        'start_time' => now()->addHours(1),
        'end_time' => now()->addHours(3),
        'status' => 'confirmed',
    ]);

    $this->place->update(['status' => 'occupied']);

    // Try to book the same place
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/book/reservation', [
            'place_id' => $this->place->id,
            'start_time' => now()->addHours(2)->toDateTimeString(),
            'end_time' => now()->addHours(4)->toDateTimeString(),
        ]);

    $response->assertStatus(422);
});

test('user can cancel their own reservation', function () {
    $reservation = Reservation::factory()->create([
        'user_id' => $this->user->id,
        'place_id' => $this->place->id,
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson("/api/cancel/{$reservation->id}/reservation");

    $response->assertStatus(200);
    expect($reservation->fresh()->status)->toBe('cancelled');
});

test('user cannot cancel another user reservation', function () {
    $otherUser = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'user_id' => $otherUser->id,
        'place_id' => $this->place->id,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson("/api/cancel/{$reservation->id}/reservation");

    $response->assertStatus(403);
});

test('admin can view analytics dashboard', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson('/api/admin/analytics/dashboard?period=week');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'occupancy_rate',
            'revenue',
            'average_duration',
            'popular_sectors',
            'peak_hours',
        ]);
});

test('regular user cannot access analytics', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/admin/analytics/dashboard');

    $response->assertStatus(403);
});

test('user can generate qr code for their reservation', function () {
    $reservation = Reservation::factory()->create([
        'user_id' => $this->user->id,
        'place_id' => $this->place->id,
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson("/api/qrcode/reservation/{$reservation->id}");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'qr_code',
            'reservation_id',
            'place_number',
        ]);
});

test('qr code check-in works correctly', function () {
    $reservation = Reservation::factory()->create([
        'user_id' => $this->user->id,
        'place_id' => $this->place->id,
        'status' => 'confirmed',
        'qr_code_token' => 'test_token_123',
    ]);

    Cache::put('qr_code:test_token_123', [
        'reservation_id' => $reservation->id,
        'user_id' => $this->user->id,
        'place_id' => $this->place->id,
    ], now()->addHours(24));

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/qrcode/check-in', [
            'qr_code' => 'test_token_123',
        ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);
    
    expect($reservation->fresh()->checked_in_at)->not->toBeNull();
});

test('user receives prediction for sector availability', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/predictions/availability', [
            'sector_id' => $this->sector->id,
            'datetime' => now()->addDays(1)->toDateTimeString(),
        ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['prediction']);
});

test('user gets recommendation for best sector', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/predictions/recommend-sector', [
            'datetime' => now()->addHours(2)->toDateTimeString(),
            'duration_hours' => 2,
        ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'sector',
            'available_places',
            'estimated_price',
            'reason',
        ]);
});
