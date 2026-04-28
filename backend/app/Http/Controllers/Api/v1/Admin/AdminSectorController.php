<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sector;
use Illuminate\Http\Request;

class AdminSectorController extends Controller
{
    /**
     * Get all sectors
     */
    public function index()
    {
        $sectors = Sector::withCount('places')->paginate(15);
        return response()->json([
            'data' => $sectors->items(),
            'meta' => [
                'total' => $sectors->total(),
                'per_page' => $sectors->perPage(),
                'current_page' => $sectors->currentPage(),
                'last_page' => $sectors->lastPage()
            ]
        ]);
    }

    /**
     * Get single sector
     */
    public function show(Sector $sector)
    {
        return response()->json([
            'data' => $sector->loadCount('places')
        ]);
    }

    /**
     * Create new sector
     */
    public function store(Request $request)
    {
        $validated = array_merge([
            'description' => '',
        ], $request->validate([
            'name' => 'required|string|unique:sectors',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0|max:9999.99'
        ]));

        $sector = Sector::create($validated);

        return response()->json([
            'message' => 'Secteur créé avec succès',
            'data' => $sector
        ], 201);
    }

    /**
     * Update sector
     */
    public function update(Request $request, Sector $sector)
    {
        $validated = $request->validate([
            'name' => 'string|unique:sectors,name,' . $sector->id,
            'description' => 'nullable|string',
            'price' => 'numeric|min:0|max:9999.99'
        ]);

        $sector->update($validated);

        return response()->json([
            'message' => 'Secteur mis à jour avec succès',
            'data' => $sector
        ]);
    }

    /**
     * Delete sector
     */
    public function destroy(Sector $sector)
    {
        $placesCount = $sector->places()->count();
        
        if ($placesCount > 0) {
            return response()->json([
                'message' => "Impossible de supprimer ce secteur car il contient $placesCount place(s). Supprimez d'abord les places de ce secteur."
            ], 409);
        }

        $sector->delete();

        return response()->json([
            'message' => 'Secteur supprimé avec succès'
        ]);
    }
}
