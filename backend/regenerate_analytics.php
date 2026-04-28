<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Carbon\Carbon;

$analyticsService = app(\App\Services\AnalyticsService::class);
$now = Carbon::today();

for ($i = 0; $i < 7; $i++) {
    $date = $now->copy()->subDays($i);
    $analyticsService->generateDailyAnalytics($date);
    echo "Regenerated analytics for " . $date->toDateString() . "\n";
}
