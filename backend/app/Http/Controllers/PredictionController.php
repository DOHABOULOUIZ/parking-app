<?php

namespace App\Http\Controllers;

use App\Services\PredictionService;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    protected $predictionService;

    public function __construct(PredictionService $predictionService)
    {
        $this->predictionService = $predictionService;
    }

    public function predictAvailability(Request $request)
    {
        $request->validate([
            'sector_id' => 'nullable|exists:sectors,id',
            'datetime' => 'required|date',
        ]);

        $sectorId = $request->input('sector_id');
        $datetime = $request->input('datetime');

        return response()->json([
            'prediction' => $this->predictionService->predictAvailability($sectorId, $datetime),
        ]);
    }

    public function recommendSector(Request $request)
    {
        $request->validate([
            'datetime' => 'required|date',
            'duration_hours' => 'required|numeric|min:0.5',
        ]);

        $recommendation = $this->predictionService->recommendBestSector(
            $request->datetime,
            $request->duration_hours,
            $request->user()->id
        );

        return response()->json($recommendation);
    }

    public function dynamicPricing(Request $request)
    {
        $request->validate([
            'sector_id' => 'required|exists:sectors,id',
            'datetime' => 'required|date',
        ]);

        $pricing = $this->predictionService->calculateDynamicPrice(
            $request->sector_id,
            $request->datetime
        );

        return response()->json($pricing);
    }

    public function peakHoursPrediction(Request $request)
    {
        $date = $request->input('date', now()->format('Y-m-d'));

        return response()->json([
            'peak_hours' => $this->predictionService->predictPeakHours($date),
        ]);
    }
}
