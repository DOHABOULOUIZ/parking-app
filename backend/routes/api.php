<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

use App\Http\Controllers\Api\v1\PlaceController;
use App\Http\Controllers\Api\v1\ReservationController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\v1\Admin\AdminUserController;
use App\Http\Controllers\Api\v1\Admin\AdminPlaceController;
use App\Http\Controllers\Api\v1\Admin\AdminSectorController;
use App\Http\Controllers\Api\v1\Admin\AdminReservationController;
use App\Http\Controllers\Api\v1\Admin\AdminTaskController;
use App\Http\Controllers\Api\v1\Admin\AdminQRScannerController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\QRCodeController;
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
    Route::get('user/reservations', [ReservationController::class, 'myReservations']);

    // places
// 🔓 Route publique pour test

    // reservations
    Route::post('book/reservation', [ReservationController::class, 'store']);
    Route::put('cancel/{reservation}/reservation', [ReservationController::class, 'cancel']);
    Route::put('start/{reservation}/parking', [ReservationController::class, 'startParking']);
    Route::put('end/{reservation}/parking', [ReservationController::class, 'endParking']);
    Route::get('reservation/{reservation}', [ReservationController::class, 'show']);
    Route::post('pay/create/{reservation}', [ReservationController::class, 'createPaymentSession']);
    Route::post('pay/check', [ReservationController::class, 'paySuccess']);

    // payment

    // broadcasting
    Route::post('broadcasting/auth', function (Request $request) {
        return Broadcast::auth($request);
    });

    // � Admin Routes (protected by admin middleware)
    Route::middleware('admin')->prefix('admin')->group(function () {

        // Dashboard
        Route::get('dashboard', [AdminDashboardController::class, 'index']);

        // Users Management
        Route::prefix('users')->group(function () {
            Route::get('', [AdminUserController::class, 'index']);
            Route::get('stats', [AdminUserController::class, 'stats']);           // before {user}
            Route::get('{user}', [AdminUserController::class, 'show']);
            Route::put('{user}', [AdminUserController::class, 'update']);
            Route::delete('{user}', [AdminUserController::class, 'destroy']);
            Route::post('{user}/change-role', [AdminUserController::class, 'changeRole']);
        });

        // Places Management
        Route::prefix('places')->group(function () {
            Route::get('', [AdminPlaceController::class, 'index']);
            Route::post('', [AdminPlaceController::class, 'store']);
            Route::get('stats', [AdminPlaceController::class, 'stats']);          // before {place}
            Route::get('sector/{sector}', [AdminPlaceController::class, 'getBySector']); // before {place}
            Route::get('{place}', [AdminPlaceController::class, 'show']);
            Route::put('{place}', [AdminPlaceController::class, 'update']);
            Route::delete('{place}', [AdminPlaceController::class, 'destroy']);
        });

        // Sectors Management
        Route::prefix('sectors')->group(function () {
            Route::get('', [AdminSectorController::class, 'index']);
            Route::post('', [AdminSectorController::class, 'store']);
            Route::get('{sector}', [AdminSectorController::class, 'show']);
            Route::put('{sector}', [AdminSectorController::class, 'update']);
            Route::delete('{sector}', [AdminSectorController::class, 'destroy']);
        });

        // Reservations Management
        Route::prefix('reservations')->group(function () {
            Route::get('', [AdminReservationController::class, 'index']);
            Route::get('statistics', [AdminReservationController::class, 'statistics']); // before {reservation}
            Route::delete('delete-all', [AdminReservationController::class, 'deleteAll']); // before {reservation}
            Route::get('{reservation}', [AdminReservationController::class, 'show']);
            Route::post('{reservation}/cancel', [AdminReservationController::class, 'cancel']);
            Route::post('{reservation}/approve', [AdminReservationController::class, 'approve']);
            Route::post('{reservation}/reject', [AdminReservationController::class, 'reject']);
        });

        // Tasks Management
        Route::prefix('tasks')->group(function () {
            Route::get('', [AdminTaskController::class, 'index']);
            Route::post('', [AdminTaskController::class, 'store']);
            Route::get('statistics', [AdminTaskController::class, 'statistics']);  // before {task}
            Route::get('{task}', [AdminTaskController::class, 'show']);
            Route::put('{task}', [AdminTaskController::class, 'update']);
            Route::delete('{task}', [AdminTaskController::class, 'destroy']);
        });

        // Analytics
        Route::prefix('analytics')->group(function () {
            Route::get('dashboard', [AnalyticsController::class, 'dashboard']);
            Route::get('occupancy-trend', [AnalyticsController::class, 'occupancyTrend']);
            Route::get('revenue-trend', [AnalyticsController::class, 'revenueTrend']);
            Route::get('cancellation-trend', [AnalyticsController::class, 'cancellationTrend']);
            Route::get('sector-comparison', [AnalyticsController::class, 'sectorComparison']);
            Route::get('hourly-occupancy', [AnalyticsController::class, 'hourlyOccupancy']);
            Route::get('top-users', [AnalyticsController::class, 'topUsers']);
            Route::get('revenue-per-place', [AnalyticsController::class, 'revenuePerPlace']);
            Route::get('duration-distribution', [AnalyticsController::class, 'durationDistribution']);
            Route::post('export-report', [AnalyticsController::class, 'exportReport']);
        });

        // QR Scanner
        Route::prefix('qr-scanner')->group(function () {
            Route::get('stats', [AdminQRScannerController::class, 'statistics']);
            Route::get('history', [AdminQRScannerController::class, 'history']);
            Route::post('verify', [AdminQRScannerController::class, 'verify']);
            Route::post('check-in', [AdminQRScannerController::class, 'checkIn']);
            Route::post('check-out', [AdminQRScannerController::class, 'checkOut']);
            Route::post('reset-stats', [AdminQRScannerController::class, 'resetStats']);
        });

    });

    // Predictions (authenticated users)
    Route::prefix('predictions')->group(function () {
        Route::post('availability', [PredictionController::class, 'predictAvailability']);
        Route::post('recommend-sector', [PredictionController::class, 'recommendSector']);
        Route::post('dynamic-pricing', [PredictionController::class, 'dynamicPricing']);
        Route::get('peak-hours', [PredictionController::class, 'peakHoursPrediction']);
    });

    // Notifications (authenticated users)
    Route::prefix('notifications')->group(function () {
        Route::get('', [NotificationController::class, 'index']);
        Route::post('{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('read-all', [NotificationController::class, 'markAllAsRead']);
        Route::get('unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('preferences', [NotificationController::class, 'updatePreferences']);
    });

    // QR Codes (authenticated users)
    Route::prefix('qrcode')->group(function () {
        Route::get('reservation/{reservation}', [QRCodeController::class, 'generate']);
        Route::post('verify', [QRCodeController::class, 'verify']);
        Route::post('check-in', [QRCodeController::class, 'checkIn']);
        Route::post('check-out', [QRCodeController::class, 'checkOut']);
    });

    // statistiques
    Route::get('statistics', [\App\Http\Controllers\StatisticsController::class, 'index']);
});
