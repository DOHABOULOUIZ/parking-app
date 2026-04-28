<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get the last reservation
$reservation = App\Models\Reservation::orderBy('id', 'desc')->first();

if ($reservation) {
    $oldStatus = $reservation->status;
    
    // Reset the reservation to 'reserved' status
    $reservation->update([
        'status' => 'reserved',
        'checked_in_at' => null,
        'checked_out_at' => null,
    ]);
    
    echo "✅ Réservation #{$reservation->id} réinitialisée\n";
    echo "   Ancien statut : {$oldStatus}\n";
    echo "   Nouveau statut : reserved\n";
    echo "   Token QR : {$reservation->qr_code_token}\n\n";
    echo "👉 Vous pouvez maintenant tester Check-In avec ce token !\n";
} else {
    echo "❌ Aucune réservation trouvée\n";
}
