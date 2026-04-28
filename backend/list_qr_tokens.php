<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "═══════════════════════════════════════════════════════════════\n";
echo "           📋 LISTE DES TOKENS QR CODE DISPONIBLES            \n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// Get all reservations that have a QR code token
$reservations = App\Models\Reservation::with(['user', 'place.sector'])
    ->whereNotNull('qr_code_token')
    ->orderBy('id', 'asc')
    ->get();

if ($reservations->isEmpty()) {
    echo "❌ Aucune réservation avec token QR trouvée\n";
    exit;
}

$count = 0;
foreach ($reservations as $res) {
    $count++;
    
    // Status emoji
    $statusEmoji = [
        'reserved' => '🟢',
        'pending' => '🟡',
        'confirmed' => '🔵',
        'parked' => '🟠',
        'finished' => '⚫',
        'cancelled' => '🔴',
    ];
    
    $emoji = $statusEmoji[$res->status] ?? '⚪';
    
    echo "─────────────────────────────────────────────────────────────\n";
    echo "Réservation #{$res->id} {$emoji} {$res->status}\n";
    echo "─────────────────────────────────────────────────────────────\n";
    echo "Client    : " . ($res->user->name ?? 'N/A') . "\n";
    echo "Place     : " . ($res->place->place_number ?? 'N/A') . "\n";
    echo "Secteur   : " . ($res->place->sector->name ?? 'N/A') . "\n";
    echo "Check-In  : " . ($res->checked_in_at ? $res->checked_in_at->format('d/m/Y H:i') : 'Non') . "\n";
    echo "Check-Out : " . ($res->checked_out_at ? $res->checked_out_at->format('d/m/Y H:i') : 'Non') . "\n";
    echo "\n🔑 TOKEN QR :\n";
    echo "{$res->qr_code_token}\n\n";
}

echo "═══════════════════════════════════════════════════════════════\n";
echo "Total : {$count} réservations avec tokens QR\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

echo "📊 LÉGENDE DES STATUTS :\n";
echo "  🟢 reserved   → Prêt pour Check-In\n";
echo "  🟡 pending    → Prêt pour Check-In\n";
echo "  🔵 confirmed  → Prêt pour Check-In\n";
echo "  🟠 parked     → Prêt pour Check-Out\n";
echo "  ⚫ finished   → Terminé (réinitialiser si besoin)\n";
echo "  🔴 cancelled  → Annulé (réinitialiser si besoin)\n\n";

echo "💡 Pour réinitialiser TOUTES les réservations au statut 'reserved' :\n";
echo "   php reset_all_reservations.php\n\n";
