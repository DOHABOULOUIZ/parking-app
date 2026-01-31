<?php

namespace App\Events;

use App\Models\Place;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlaceStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $place;

    /**
     * Create a new event instance.
     */
    public function __construct(Place $place)
    {
        $this->place = $place;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     */
    public function broadcastOn()
    {
        return new PrivateChannel('places');
    }

    public function broadcastWith()
    {
        return ['place' => $this->place->load('sector', 'reservations')];
    }

    public function broadcastAs()
    {
        return 'placeUpdated';
    }
}
