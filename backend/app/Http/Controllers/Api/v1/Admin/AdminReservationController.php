<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class AdminReservationController extends Controller
{
    /**
     * Get all reservations
     */
    public function index(Request $request)
    {
        try {
            $query = Reservation::with(['user', 'place.sector']);

            // Filtrer par statut
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filtrer par utilisateur
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            $reservations = $query->orderBy('created_at', 'desc')->paginate(30);

            return response()->json([
                'data' => $reservations->items(),
                'meta' => [
                    'total' => $reservations->total(),
                    'per_page' => $reservations->perPage(),
                    'current_page' => $reservations->currentPage(),
                    'last_page' => $reservations->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors du chargement des réservations',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single reservation
     */
    public function show(Reservation $reservation)
    {
        try {
            return response()->json([
                'data' => $reservation->load(['user', 'place.sector'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors du chargement de la réservation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics
     */
    public function statistics()
    {
        return response()->json([
            'data' => [
                'total_reservations' => Reservation::count(),
                'ongoing' => Reservation::whereIn('status', ['reserved', 'parked'])->count(),
                'completed' => Reservation::where('status', 'finished')->count(),
                'cancelled' => Reservation::where('status', 'cancelled')->count(),
                'total_revenue' => Reservation::where('status', 'finished')->sum('amount')
            ]
        ]);
    }

    /**
     * Cancel reservation
     */
    public function cancel(Reservation $reservation)
    {
        if ($reservation->status === 'cancelled') {
            return response()->json([
                'message' => 'Cette réservation est déjà annulée'
            ], 409);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Réservation annulée avec succès',
            'data' => $reservation
        ]);
    }

    /**
     * Approve reservation
     */
    public function approve(Reservation $reservation)
    {
        if ($reservation->is_approved) {
            return response()->json([
                'message' => 'Cette réservation est déjà approuvée'
            ], 409);
        }

        $reservation->update([
            'is_approved' => true,
            'rejection_reason' => null
        ]);
        
        // TODO: Send notification to user (email, SMS, push notification)
        // Notification::send($reservation->user, new ReservationApprovedNotification($reservation));

        return response()->json([
            'message' => '✅ Réservation approuvée ! L\'utilisateur peut maintenant se garer.',
            'data' => $reservation
        ]);
    }

    /**
     * Reject reservation
     */
    public function reject(Reservation $reservation, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:255'
        ]);

        if ($reservation->status === 'cancelled') {
            return response()->json([
                'message' => 'Impossible de rejeter une réservation annulée'
            ], 409);
        }

        $reservation->update([
            'is_approved' => false,
            'status' => 'cancelled',
            'rejection_reason' => $request->reason
        ]);
        
        // Release the place to make it available again
        $reservation->place()->update(['status' => 'available']);
        
        // TODO: Send notification to user (email, SMS, push notification)
        // Notification::send($reservation->user, new ReservationRejectedNotification($reservation));

        return response()->json([
            'message' => '❌ Réservation rejetée. L\'utilisateur sera notifié avec la raison.',
            'data' => $reservation
        ]);
    }

    /**
     * Delete all reservations
     */
    public function deleteAll()
    {
        try {
            // Release all places to available
            $reservations = Reservation::all();
            foreach ($reservations as $reservation) {
                if ($reservation->place) {
                    $reservation->place->update(['status' => 'available']);
                }
            }
            
            // Delete all reservations
            Reservation::truncate();

            return response()->json([
                'message' => 'Toutes les réservations ont été supprimées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
