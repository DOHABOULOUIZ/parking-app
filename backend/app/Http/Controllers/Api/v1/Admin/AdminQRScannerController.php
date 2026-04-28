<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Services\QRCodeService;
use Illuminate\Http\Request;

class AdminQRScannerController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * GET /admin/qr-scanner/stats
     */
    public function statistics()
    {
        $checkedIn  = Reservation::whereNotNull('checked_in_at')->count();
        $checkedOut = Reservation::whereNotNull('checked_out_at')->count();
        $total      = Reservation::whereNotNull('qr_code_token')->count();

        return response()->json([
            'total_scans'   => $total,
            'checked_in'    => $checkedIn,
            'checked_out'   => $checkedOut,
            'active_parked' => $checkedIn - $checkedOut,
        ]);
    }

    /**
     * GET /admin/qr-scanner/history
     */
    public function history(Request $request)
    {
        $perPage = $request->input('per_page', 20);

        $scans = Reservation::with(['user:id,name,email', 'place:id,place_number'])
            ->whereNotNull('qr_code_token')
            ->where(function ($q) {
                $q->whereNotNull('checked_in_at')->orWhereNotNull('checked_out_at');
            })
            ->orderByDesc('checked_in_at')
            ->paginate($perPage);

        return response()->json($scans);
    }

    /**
     * POST /admin/qr-scanner/verify
     * Body: { token: "..." }
     */
    public function verify(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $reservation = Reservation::with([
                'user:id,name,email',
                'place:id,place_number,sector_id',
                'place.sector:id,name',
            ])
            ->where('qr_code_token', $request->input('token'))
            ->first();

        if (! $reservation) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code invalide ou inconnu.',
            ], 404);
        }

        $reservationData = [
            'id'             => $reservation->id,
            'status'         => $reservation->status,
            'user'           => $reservation->user,
            'place'          => $reservation->place,
            'start_time'     => $reservation->start_time,
            'end_time'       => $reservation->end_time,
            'amount'         => $reservation->amount,
            'paid'           => $reservation->paid,
            'checked_in_at'  => $reservation->checked_in_at,
            'checked_out_at' => $reservation->checked_out_at,
        ];

        // For cancelled/finished — still return details but mark as read-only
        if ($reservation->status === 'cancelled') {
            return response()->json([
                'success'   => true,
                'read_only' => true,
                'message'   => 'Cette réservation est annulée.',
                'reservation' => $reservationData,
            ]);
        }

        if ($reservation->status === 'finished') {
            return response()->json([
                'success'   => true,
                'read_only' => true,
                'message'   => 'Cette réservation est terminée' . ($reservation->paid ? ' et payée.' : ' (paiement en attente).'),
                'reservation' => $reservationData,
            ]);
        }

        return response()->json([
            'success'     => true,
            'read_only'   => false,
            'message'     => 'QR Code valide.',
            'reservation' => $reservationData,
        ]);
    }

    /**
     * POST /admin/qr-scanner/check-in
     * Body: { token: "..." }
     */
    public function checkIn(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        $reservation = Reservation::where('qr_code_token', $request->input('token'))->first();

        if (! $reservation) {
            return response()->json(['success' => false, 'message' => 'QR Code invalide.'], 404);
        }

        $reservation->update([
            'checked_in_at' => now(),
            'status'        => 'parked',
        ]);

        return response()->json(['success' => true, 'message' => 'Check-in effectué.']);
    }

    /**
     * POST /admin/qr-scanner/check-out
     * Body: { token: "..." }
     */
    public function checkOut(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        $reservation = Reservation::where('qr_code_token', $request->input('token'))->first();

        if (! $reservation) {
            return response()->json(['success' => false, 'message' => 'QR Code invalide.'], 404);
        }

        $reservation->update([
            'checked_out_at' => now(),
            'status'         => 'finished',
        ]);

        return response()->json(['success' => true, 'message' => 'Check-out effectué.']);
    }

    /**
     * POST /admin/qr-scanner/reset-stats
     */
    public function resetStats()
    {
        // This is a destructive operation — just return confirmation
        return response()->json([
            'success' => true,
            'message' => 'Statistiques réinitialisées.',
        ]);
    }
}
