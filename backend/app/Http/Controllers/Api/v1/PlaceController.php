<?php

namespace App\Http\Controllers\Api\v1;

use App\Models\Place;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\PlaceResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceController extends Controller
{
    //
    public function index(Request $request):JsonResource
    {
        $perPage = (int) $request->input('per_page', 6);
        $places  = Place::with('sector', 'reservations')->paginate($perPage);
        return PlaceResource::collection($places);
    }
}
