<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\AnalyticsService;
use Carbon\Carbon;

echo "=== GENERATING ANALYTICS ===\n";

$analyticsService = new AnalyticsService();

// Generate analytics for today
$today = Carbon::today();
echo "Generating analytics for: " . $today->toDateString() . "\n";

try {
    $analyticsService->generateDailyAnalytics($today);
    echo "✅ Analytics generated successfully!\n";
} catch (Exception $e) {
    echo "❌ Error generating analytics: " . $e->getMessage() . "\n";
}

// Check if analytics were created
$analyticsCount = \App\Models\Analytic::count();
echo "Analytics count after generation: " . $analyticsCount . "\n";

if ($analyticsCount > 0) {
    $sample = \App\Models\Analytic::first();
    echo "Sample analytic: " . json_encode($sample->toArray(), JSON_PRETTY_PRINT) . "\n";
}