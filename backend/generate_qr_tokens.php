<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get reservations without QR code token
$reservations = App\Models\Reservation::whereNull('qr_code_token')
    ->orWhere('qr_code_token', '')
    ->get();

$qrCodeService = new App\Services\QRCodeService();

foreach ($reservations as $reservation) {
    $token = $qrCodeService->generateQRCode($reservation);
    echo "✅ Token généré pour réservation #{$reservation->id}\n";
    echo "   Token : {$token}\n\n";
}

// Show the last reservation for testing
$last = App\Models\Reservation::orderBy('id', 'desc')->first();
if ($last) {
    echo "📱 Dernière réservation pour test :\n";
    echo "   ID : {$last->id}\n";
    echo "   Statut : {$last->status}\n";
    echo "   Token : {$last->qr_code_token}\n\n";
    echo "👉 Copiez ce token dans le scanner admin !\n";
}
