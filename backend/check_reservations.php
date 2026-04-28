<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$reservations = DB::table('reservations')->get();
echo "Total reservations: " . $reservations->count() . "\n";
if ($reservations->count() > 0) {
    echo "Statuses: " . $reservations->pluck('status')->unique()->implode(', ') . "\n";
    echo "Sample reservation: " . json_encode($reservations->first()) . "\n";
}