<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    public function view(User $user, User $model)
    {
        return $user->id === $model->id || $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model)
    {
        return $user->id === $model->id || $user->isAdmin();
    }

    public function delete(User $user, User $model)
    {
        // Cannot delete yourself
        if ($user->id === $model->id) {
            return false;
        }
        
        return $user->isAdmin();
    }

    public function changeRole(User $user, User $model)
    {
        // Only admins can change roles
        // Cannot change your own role
        return $user->isAdmin() && $user->id !== $model->id;
    }

    public function viewAnalytics(User $user)
    {
        return $user->isAdmin();
    }
}
