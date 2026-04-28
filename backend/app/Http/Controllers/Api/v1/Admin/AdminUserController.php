<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;

class AdminUserController extends Controller
{
    /**
     * Get all users
     */
    public function index()
    {
        $users = User::paginate(15);
        return response()->json([
            'data' => UserResource::collection($users->items()),
            'meta' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage()
            ]
        ]);
    }

    /**
     * Get single user
     */
    public function show(User $user)
    {
        return response()->json([
            'data' => UserResource::make($user)
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'role' => 'in:user,admin',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => UserResource::make($user)
        ]);
    }

    /**
     * Delete user
     */
    public function destroy(User $user)
    {
        // Empêcher la suppression du compte admin en cours
        if ($user->isAdmin() && Auth::user()->id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte admin'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    /**
     * Change user role
     */
    public function changeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:user,admin'
        ]);

        // Empêcher l'auto-dégradation
        if (Auth::user()->id === $user->id && $validated['role'] === 'user') {
            return response()->json([
                'message' => 'Vous ne pouvez pas vous retirer les droits admin'
            ], 403);
        }

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'Rôle utilisateur modifié avec succès',
            'data' => UserResource::make($user)
        ]);
    }

    /**
     * Get users statistics
     */
    public function stats()
    {
        $total = User::count();
        $admins = User::where('role', 'admin')->count();
        $users = User::where('role', 'user')->count();
        $active = User::whereDate('updated_at', '>=', now()->subDay())->count();

        return response()->json([
            'total' => $total,
            'admins' => $admins,
            'users' => $users,
            'active' => $active
        ]);
    }
}
