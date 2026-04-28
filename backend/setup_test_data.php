<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Reservation;
use App\Models\User;
use App\Models\Place;
use Carbon\Carbon;

// Vider toutes les réservations
Reservation::query()->delete();
echo "✓ Toutes les réservations supprimées\n";

// Récupérer un user de test
$user = User::where('email', 'test@test.com')->first();
if (!$user) {
    $user = User::first();
}

// Récupérer une place
$place = Place::first();

if ($user && $place) {
    // Créer une réservation de test
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'place_id' => $place->id,
        'start_time' => Carbon::now(),
        'end_time' => Carbon::now()->addHours(2),
        'status' => 'reserved',
        'amount' => $place->sector->price ?? 5,
        'paid' => false,
        'is_approved' => false, // Non approuvée initialement
        'qr_code_token' => \Illuminate\Support\Str::random(32),
    ]);

    echo "✓ Réservation de test créée:\n";
    echo "  - ID: {$reservation->id}\n";
    echo "  - User: {$user->name}\n";
    echo "  - Place: {$place->number}\n";
    echo "  - Status: {$reservation->status}\n";
    echo "  - is_approved: " . ($reservation->is_approved ? 'true' : 'false') . "\n";
    echo "  - paid: " . ($reservation->paid ? 'true' : 'false') . "\n";
} else {
    echo "✗ Pas d'user ou place trouvée\n";
}
