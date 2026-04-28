<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * Récupérer les statistiques dynamiques depuis la base de données.
     */
    public function index()
    {
        // Exemple de récupération de données
        $statistics = [
            'total_users' => DB::table('users')->count(),
            'total_reservations' => DB::table('reservations')->count(),
            'total_places' => DB::table('places')->count(),
        ];

        return response()->json($statistics);
    }
}