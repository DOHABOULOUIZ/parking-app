<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

echo "Creating test reservations for analytics...\n";

// Get existing user and place
$user = DB::table('users')->first();
$place = DB::table('places')->first();

if (!$user || !$place) {
    echo "No user or place found!\n";
    exit(1);
}

$now = Carbon::now();

// Create reservations for the last 7 days
for ($i = 0; $i < 7; $i++) {
    $date = $now->copy()->subDays($i);

    // Morning reservation (finished)
    DB::table('reservations')->insert([
        'user_id' => $user->id,
        'place_id' => $place->id,
        'start_time' => $date->copy()->setHour(9)->setMinute(0),
        'end_time' => $date->copy()->setHour(12)->setMinute(0),
        'status' => 'finished',
        'qr_code_token' => 'test_' . $i . '_morning',
        'amount' => 15.00,
        'paid' => 1,
        'is_approved' => 1,
        'created_at' => $date->copy()->setHour(8)->setMinute(30),
        'updated_at' => $date->copy()->setHour(12)->setMinute(0),
    ]);

    // Afternoon reservation (finished)
    DB::table('reservations')->insert([
        'user_id' => $user->id,
        'place_id' => $place->id,
        'start_time' => $date->copy()->setHour(14)->setMinute(0),
        'end_time' => $date->copy()->setHour(18)->setMinute(0),
        'status' => 'finished',
        'qr_code_token' => 'test_' . $i . '_afternoon',
        'amount' => 20.00,
        'paid' => 1,
        'is_approved' => 1,
        'created_at' => $date->copy()->setHour(13)->setMinute(30),
        'updated_at' => $date->copy()->setHour(18)->setMinute(0),
    ]);

    // Current day - add some active reservations
    if ($i === 0) {
        DB::table('reservations')->insert([
            'user_id' => $user->id,
            'place_id' => $place->id,
            'start_time' => $now->copy()->subHours(2),
            'end_time' => $now->copy()->addHours(4),
            'status' => 'parked',
            'qr_code_token' => 'test_current_parked',
            'amount' => null,
            'paid' => 0,
            'is_approved' => 1,
            'created_at' => $now->copy()->subHours(2)->subMinutes(30),
            'updated_at' => $now->copy()->subHours(2),
        ]);
    }
}

echo "Test reservations created successfully!\n";

// Regenerate analytics for the last 7 days
$analyticsService = app(\App\Services\AnalyticsService::class);

for ($i = 0; $i < 7; $i++) {
    $date = $now->copy()->subDays($i);
    $analyticsService->generateDailyAnalytics($date);
    echo "Generated analytics for: " . $date->toDateString() . "\n";
}

echo "Analytics regeneration complete!\n";