<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

use App\Http\Controllers\Api\v1\PlaceController;
use App\Http\Controllers\Api\v1\ReservationController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Resources\UserResource;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🔓 Routes publiques (guest)
Route::post('user/register', [UserController::class, 'store']);
Route::post('user/login', [UserController::class, 'auth']);
Route::get('places', [PlaceController::class, 'index']);
Route::post('pay/check', [ReservationController::class, 'paySuccess']);

// 🔐 Routes protégées par Sanctum (Bearer Token)
Route::middleware('auth:sanctum')->group(function () {

    // user
    Route::get('user', function (Request $request) {
        return response()->json([
            'user' => UserResource::make($request->user()),
            'access_token' => $request->bearerToken()
        ]);
    });

    Route::post('user/logout', [UserController::class, 'logout']);

    // places
// 🔓 Route publique pour test

    // reservations
    Route::post('book/reservation', [ReservationController::class, 'store']);
    Route::put('cancel/{reservation}/reservation', [ReservationController::class, 'cancel']);
    Route::put('start/{reservation}/parking', [ReservationController::class, 'startParking']);
    Route::put('end/{reservation}/parking', [ReservationController::class, 'endParking']);
    Route::get('reservation/{reservation}', [ReservationController::class, 'show']);
    Route::post('pay/create/{reservation}', [ReservationController::class, 'createPaymentSession']);

    // payment

    // broadcasting
    Route::post('broadcasting/auth', function (Request $request) {
        return Broadcast::auth($request);
    });
});
