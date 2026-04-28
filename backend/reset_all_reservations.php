<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "═══════════════════════════════════════════════════════════════\n";
echo "      🔄 RÉINITIALISATION DES RÉSERVATIONS POUR TESTS         \n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// Get all reservations with QR tokens
$reservations = App\Models\Reservation::whereNotNull('qr_code_token')->get();

if ($reservations->isEmpty()) {
    echo "❌ Aucune réservation à réinitialiser\n";
    exit;
}

echo "📋 {$reservations->count()} réservation(s) trouvée(s)\n\n";

foreach ($reservations as $res) {
    $oldStatus = $res->status;
    
    // Reset to 'reserved' status
    $res->update([
        'status' => 'reserved',
        'checked_in_at' => null,
        'checked_out_at' => null,
    ]);
    
    echo "✅ Réservation #{$res->id}\n";
    echo "   {$oldStatus} → reserved\n";
    echo "   Token : {$res->qr_code_token}\n\n";
}

echo "═══════════════════════════════════════════════════════════════\n";
echo "✅ Toutes les réservations sont maintenant au statut 'reserved'\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

echo "🧪 VOUS POUVEZ MAINTENANT TESTER :\n";
echo "  1️⃣  Check-In  → statut passe à 'parked'\n";
echo "  2️⃣  Check-Out → statut passe à 'finished'\n\n";

echo "📋 Pour voir la liste des tokens :\n";
echo "   php list_qr_tokens.php\n\n";
