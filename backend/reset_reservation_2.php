<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Reset reservation #2
$reservation = App\Models\Reservation::find(2);

if ($reservation) {
    $reservation->update([
        'status' => 'reserved',
        'checked_in_at' => null,
        'checked_out_at' => null,
    ]);
    
    echo "✅ Réservation #2 réinitialisée au statut: reserved\n";
    echo "   Token : {$reservation->qr_code_token}\n\n";
    echo "👉 Maintenant faites Check-In avec ce token !\n";
} else {
    echo "❌ Réservation #2 non trouvée\n";
}
