<?php

namespace App\Services;

use App\Models\Reservation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class QRCodeService
{
    public function generateQRCode(Reservation $reservation)
    {
        // Generate unique token for this reservation
        $token = Str::random(32);
        
        // Store token in cache with reservation data (expires in 24 hours)
        Cache::put(
            "qr_code:{$token}",
            [
                'reservation_id' => $reservation->id,
                'user_id' => $reservation->user_id,
                'place_id' => $reservation->place_id,
                'generated_at' => now(),
            ],
            now()->addHours(24)
        );

        // Store token in reservation
        $reservation->update(['qr_code_token' => $token]);

        return $token;
    }

    public function verifyQRCode($token)
    {
        // Try cache first for performance
        $data = Cache::get("qr_code:{$token}");

        if ($data) {
            $reservation = Reservation::with(['place.sector', 'user'])
                ->find($data['reservation_id']);
        } else {
            // Fallback: search in database if cache is empty
            $reservation = Reservation::with(['place.sector', 'user'])
                ->where('qr_code_token', $token)
                ->first();
        }

        if (!$reservation) {
            return [
                'success' => false,
                'message' => 'QR Code invalide ou expiré',
            ];
        }

        return [
            'success' => true,
            'reservation' => $reservation,
            'place' => $reservation->place,
            'user' => $reservation->user,
        ];
    }

    public function checkIn($token)
    {
        $verification = $this->verifyQRCode($token);

        if (!$verification['success']) {
            return $verification;
        }

        $reservation = $verification['reservation'];

        // Check if already checked in
        if ($reservation->checked_in_at) {
            return [
                'success' => false,
                'message' => 'Déjà enregistré',
            ];
        }

        // Check if reservation is active (accept 'reserved', 'confirmed', or 'pending')
        $validStatuses = ['reserved', 'confirmed', 'pending'];
        if (!in_array($reservation->status, $validStatuses)) {
            // Generate specific message based on status
            $statusMessages = [
                'parked' => 'Cette réservation a déjà un check-in actif. Veuillez d\'abord faire le check-out.',
                'finished' => 'Cette réservation est terminée. Un nouveau check-in ne peut pas être effectué.',
                'cancelled' => 'Cette réservation a été annulée. Vous ne pouvez pas effectuer de check-in.',
            ];
            
            $message = $statusMessages[$reservation->status] ?? "Réservation non disponible pour check-in. Statut: {$reservation->status}";
            
            return [
                'success' => false,
                'message' => $message,
            ];
        }

        $reservation->update([
            'checked_in_at' => now(),
            'status' => 'parked',
        ]);

        return [
            'success' => true,
            'message' => 'Check-in réussi',
            'reservation' => $reservation,
        ];
    }

    public function checkOut($token)
    {
        $verification = $this->verifyQRCode($token);

        if (!$verification['success']) {
            return $verification;
        }

        $reservation = $verification['reservation'];

        // Check if checked in
        if (!$reservation->checked_in_at) {
            return [
                'success' => false,
                'message' => 'Aucun check-in enregistré. Veuillez d\'abord effectuer un check-in.',
            ];
        }

        // Check if already checked out
        if ($reservation->checked_out_at) {
            return [
                'success' => false,
                'message' => 'Cette réservation a déjà un check-out enregistré. Elle est complètement terminée.',
            ];
        }

        $reservation->update([
            'checked_out_at' => now(),
            'status' => 'finished',
        ]);

        // Free the place
        $reservation->place->update(['status' => 'available']);

        // Calculate actual duration and any additional fees
        $actualDuration = $reservation->checked_out_at->diffInHours($reservation->checked_in_at);
        $reservedDuration = $reservation->end_time->diffInHours($reservation->start_time);

        $additionalFees = max(0, ($actualDuration - $reservedDuration) * ($reservation->place->sector->price ?? 0));

        return [
            'success' => true,
            'message' => 'Check-out réussi',
            'reservation' => $reservation,
            'actual_duration' => $actualDuration,
            'additional_fees' => $additionalFees,
        ];
    }
}
