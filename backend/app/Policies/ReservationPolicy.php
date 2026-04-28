<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReservationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->user_id || $user->isAdmin();
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->user_id || $user->isAdmin();
    }

    public function delete(User $user, Reservation $reservation)
    {
        return $user->isAdmin();
    }

    public function cancel(User $user, Reservation $reservation)
    {
        // Users can cancel their own reservations if not started
        if ($user->id === $reservation->user_id) {
            return !$reservation->checked_in_at;
        }
        
        // Admins can cancel any reservation
        return $user->isAdmin();
    }

    public function checkIn(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->user_id || $user->isAdmin();
    }

    public function checkOut(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->user_id || $user->isAdmin();
    }
}
