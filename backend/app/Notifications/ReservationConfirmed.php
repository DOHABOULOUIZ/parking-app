<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationConfirmed extends Notification implements ShouldQueue
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
            ->subject('Réservation confirmée')
            ->line('Votre réservation a été confirmée avec succès.')
            ->line('Place: ' . $this->reservation->place->number)
            ->line('Secteur: ' . $this->reservation->place->sector->name)
            ->line('Du: ' . $this->reservation->start_time->format('d/m/Y H:i'))
            ->line('Au: ' . $this->reservation->end_time->format('d/m/Y H:i'))
            ->action('Voir mon QR Code', url('/reservations/' . $this->reservation->id . '/qrcode'))
            ->line('Présentez votre QR Code à l\'entrée du parking.');
    }

    public function toArray($notifiable)
    {
        return [
            'reservation_id' => $this->reservation->id,
            'place_number' => $this->reservation->place->number,
            'start_time' => $this->reservation->start_time,
            'end_time' => $this->reservation->end_time,
            'message' => 'Votre réservation a été confirmée',
        ];
    }
}
