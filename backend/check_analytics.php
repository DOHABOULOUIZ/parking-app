<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$analytics = DB::table('analytics')->get();
echo "Analytics records: " . $analytics->count() . "\n";
if ($analytics->count() > 0) {
    echo "Latest record: " . json_encode($analytics->last()) . "\n";
}