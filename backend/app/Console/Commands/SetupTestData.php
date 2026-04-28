<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Place;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SetupTestData extends Command
{
    protected $signature = 'setup:test-data';
    protected $description = 'Vider les réservations et créer une réservation de test';

    public function handle()
    {
        // Supprimer toutes les réservations
        Reservation::query()->delete();
        $this->info('✓ Toutes les réservations supprimées');

        // Récupérer l'user "test"
        $user = User::where('email', 'test@example.com')->first();
        if (!$user) {
            $user = User::where('name', 'test')->first();
        }
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

            $this->info("✓ Réservation de test créée:");
            $this->line("  - ID: {$reservation->id}");
            $this->line("  - User: {$user->name}");
            $this->line("  - Place: {$place->number}");
            $this->line("  - Statut: {$reservation->status}");
            $this->line("  - is_approved: " . ($reservation->is_approved ? 'true' : 'false'));
            $this->line("  - paid: " . ($reservation->paid ? 'true' : 'false'));
        } else {
            $this->error('✗ Pas d\'user ou place trouvée');
        }
    }
}
