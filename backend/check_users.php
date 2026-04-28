<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$users = User::all();
echo "Users in database: " . $users->count() . "\n";
foreach($users as $user) {
    echo $user->id . ': ' . $user->name . ' (' . $user->email . ')' . "\n";
}