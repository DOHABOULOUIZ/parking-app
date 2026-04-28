<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationExpiringSoon extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre réservation expire bientôt')
            ->line('Votre réservation pour la place ' . $this->reservation->place->number . ' expire dans 1 heure.')
            ->line('Heure de fin: ' . $this->reservation->end_time->format('d/m/Y H:i'))
            ->action('Voir la réservation', url('/reservations/' . $this->reservation->id))
            ->line('Pensez à prolonger votre réservation si nécessaire.');
    }

    public function toArray($notifiable)
    {
        return [
            'reservation_id' => $this->reservation->id,
            'place_number' => $this->reservation->place->number,
            'end_time' => $this->reservation->end_time,
            'message' => 'Votre réservation expire dans 1 heure',
        ];
    }
}
