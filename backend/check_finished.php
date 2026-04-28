<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$reservations = DB::table('reservations')->where('status', 'finished')->get();
echo "Finished reservations: " . $reservations->count() . "\n";
foreach($reservations as $r) {
    echo $r->id . ': ' . $r->start_time . ' to ' . $r->end_time . ' = ' . $r->amount . '€' . "\n";
}