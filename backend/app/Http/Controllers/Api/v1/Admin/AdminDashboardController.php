<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Place;
use App\Models\Sector;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index()
    {
        $ongoingStatuses = ['reserved', 'parked'];

        return response()->json([
            'data' => [
                'users' => [
                    'total' => User::count(),
                    'admins' => User::where('role', 'admin')->count(),
                    'users' => User::where('role', 'user')->count(),
                ],
                'places' => [
                    'total' => Place::count(),
                    'available' => Place::where('status', 'available')->count(),
                    'occupied' => Place::where('status', 'occupied')->count(),
                    'reserved' => Place::where('status', 'reserved')->count(),
                ],
                'sectors' => [
                    'total' => Sector::count(),
                ],
                'reservations' => [
                    'total' => Reservation::count(),
                    'ongoing' => Reservation::whereIn('status', $ongoingStatuses)->count(),
                    'completed' => Reservation::where('status', 'finished')->count(),
                    'cancelled' => Reservation::where('status', 'cancelled')->count(),
                ],
                'revenue' => [
                    'total' => (float) Reservation::where('status', 'finished')->sum('amount'),
                    'pending' => (float) Reservation::whereIn('status', $ongoingStatuses)->sum('amount'),
                ]
            ]
        ]);
    }
}
