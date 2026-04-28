<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    public function generate(Request $request, $reservationId)
    {
        $reservation = Reservation::with(['place.sector', 'user'])->findOrFail($reservationId);

        // Check if user owns this reservation or is admin
        if ($reservation->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Use existing QR code if available, otherwise generate new one
        if ($reservation->qr_code_token) {
            $qrCode = $reservation->qr_code_token;
        } else {
            $qrCode = $this->qrCodeService->generateQRCode($reservation);
        }

        // Generate QR code image as SVG (no imagick extension needed)
        $qrCodeImage = QrCode::format('svg')
            ->size(300)
            ->margin(2)
            ->errorCorrection('H')
            ->generate($qrCode);

        return response()->json([
            'qr_code' => $qrCode,
            'qr_code_image' => 'data:image/svg+xml;base64,' . base64_encode($qrCodeImage),
            'reservation_id' => $reservation->id,
            'place_number' => $reservation->place->place_number ?? 'N/A',
            'sector_name' => $reservation->place->sector->name ?? 'N/A',
            'start_time' => $reservation->start_time,
            'end_time' => $reservation->end_time,
            'status' => $this->mapStatus($reservation->status),
            'user_name' => $reservation->user->name ?? 'N/A',
            'vehicle_info' => $reservation->vehicle_registration ?? 'N/A',
            'total_price' => $reservation->amount ?? 0,
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Map old status to new format for backward compatibility
     */
    private function mapStatus($status)
    {
        $statusMap = [
            'reserved' => 'confirmed',
            'parked' => 'active',
            'finished' => 'completed',
            'cancelled' => 'cancelled',
        ];

        return $statusMap[$status] ?? $status;
    }

    public function verify(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $result = $this->qrCodeService->verifyQRCode($request->qr_code);

        return response()->json($result);
    }

    public function checkIn(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $result = $this->qrCodeService->checkIn($request->qr_code);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $result = $this->qrCodeService->checkOut($request->qr_code);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }
}
