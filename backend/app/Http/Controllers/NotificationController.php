<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\ReservationExpiringSoon;
use App\Notifications\PlaceAvailableNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->paginate(20);

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $request->validate([
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'reservation_reminders' => 'boolean',
            'promotional_offers' => 'boolean',
        ]);

        $user = $request->user();
        $user->notification_preferences = $request->all();
        $user->save();

        return response()->json(['message' => 'Préférences mises à jour avec succès']);
    }
}
