<?php

namespace App\Notifications;

use App\Models\Place;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PlaceAvailableNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $place;

    public function __construct(Place $place)
    {
        $this->place = $place;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Une place est maintenant disponible')
            ->line('La place ' . $this->place->number . ' dans le secteur ' . $this->place->sector->name . ' est maintenant disponible.')
            ->action('Réserver maintenant', url('/places/' . $this->place->id))
            ->line('Ne manquez pas cette opportunité!');
    }

    public function toArray($notifiable)
    {
        return [
            'place_id' => $this->place->id,
            'place_number' => $this->place->number,
            'sector_name' => $this->place->sector->name,
            'message' => 'Une place est disponible dans votre secteur préféré',
        ];
    }
}
