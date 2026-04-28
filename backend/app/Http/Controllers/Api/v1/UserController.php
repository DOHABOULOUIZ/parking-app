<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Store new user
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request):JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        User::create($data);
        return response()->json([
            'message' => 'Compte créé avec succès.'
        ]);
    }

    /**
     * Log in the user
     *
     * @param AuthUserRequest $request
     * @return JsonResponse
     */
    public function auth(AuthUserRequest $request):JsonResponse
    {
        $request->validated();
        $user = User::whereEmail($request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.'
            ]);
        }

        return response()->json([
            'user' => UserResource::make($user),
            'access_token' => $user->createToken('new_user')->plainTextToken,
            'message' => 'Connecté avec succès.'
        ]);
    }

    /**
     * Log out the user
     *
     * @param Request $request
     * @return void
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Déconnecté avec succès.'
        ]);
    }
}
