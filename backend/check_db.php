<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Reservation;
use App\Models\Place;
use App\Models\Analytic;

echo "=== DATABASE CHECK ===\n";
echo "Reservations count: " . Reservation::count() . "\n";
echo "Places count: " . Place::count() . "\n";
echo "Analytics count: " . Analytic::count() . "\n";

if (Reservation::count() > 0) {
    $sample = Reservation::first();
    echo "Sample reservation: " . json_encode($sample->toArray(), JSON_PRETTY_PRINT) . "\n";
} else {
    echo "No reservations found!\n";
}

if (Analytic::count() > 0) {
    $sample = Analytic::first();
    echo "Sample analytic: " . json_encode($sample->toArray(), JSON_PRETTY_PRINT) . "\n";
} else {
    echo "No analytics data found!\n";
}