<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$user = User::where('email', 'admin@example.com')->first();
if ($user) {
    $token = $user->createToken('test')->plainTextToken;
    echo "Token: " . $token . "\n";
} else {
    echo "Admin user not found\n";
}