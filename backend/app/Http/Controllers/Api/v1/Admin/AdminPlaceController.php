<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Place;
use App\Models\Sector;
use App\Events\PlaceCreated;
use Illuminate\Http\Request;

class AdminPlaceController extends Controller
{
    /**
     * Get all places
     */
    public function index()
    {
        $places = Place::with('sector')->paginate(30);
        return response()->json([
            'data' => $places->items(),
            'meta' => [
                'total' => $places->total(),
                'per_page' => $places->perPage(),
                'current_page' => $places->currentPage(),
                'last_page' => $places->lastPage()
            ]
        ]);
    }

    /**
     * Get single place
     */
    public function show(Place $place)
    {
        return response()->json([
            'data' => $place->load('sector')
        ]);
    }

    /**
     * Create new place
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sector_id' => 'required|integer|exists:sectors,id',
                'place_number' => 'required|string|unique:places,place_number',
                'status' => 'nullable|in:available,occupied,reserved'
            ]);

            $place = Place::create($validated);

            // Broadcast the place creation event
            PlaceCreated::dispatch($place);

            return response()->json([
                'message' => 'Place créée avec succès',
                'data' => $place
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update place
     */
    public function update(Request $request, Place $place)
    {
        $validated = $request->validate([
            'sector_id' => 'exists:sectors,id',
            'place_number' => 'string|unique:places,place_number,' . $place->id,
            'status' => 'in:available,occupied,reserved'
        ]);

        $place->update($validated);

        return response()->json([
            'message' => 'Place mise à jour avec succès',
            'data' => $place
        ]);
    }

    /**
     * Delete place
     */
    public function destroy(Place $place)
    {
        $place->delete();

        return response()->json([
            'message' => 'Place supprimée avec succès'
        ]);
    }

    /**
     * Get places by sector
     */
    public function getBySector(Sector $sector)
    {
        $places = $sector->places()->paginate(30);
        return response()->json([
            'data' => $places,
            'meta' => [
                'total' => $places->total(),
                'per_page' => $places->perPage(),
                'current_page' => $places->currentPage(),
                'last_page' => $places->lastPage()
            ]
        ]);
    }

    /**
     * Get places statistics
     */
    public function stats()
    {
        $total = Place::count();
        $available = Place::where('status', 'available')->count();
        $occupied = Place::where('status', 'occupied')->count();
        $reserved = Place::where('status', 'reserved')->count();

        return response()->json([
            'total' => $total,
            'available' => $available,
            'occupied' => $occupied,
            'reserved' => $reserved
        ]);
    }
}
