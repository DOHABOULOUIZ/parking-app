<?php

namespace App\Http\Controllers\Api\v1;

use App\Events\PlaceStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Resources\PlaceResource;
use App\Models\Place;
use App\Models\Reservation;
use App\Models\StripeSession;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session;
use Stripe\Exception\OAuth\InvalidRequestException;
use Stripe\Stripe;

class ReservationController extends Controller
{
    /**
     * Book a reservation
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request):JsonResponse
    {
        //check if user already has an unpaid reservation
        $unpaidReservation = Reservation::where([
            'user_id' => $request->user()->id,
            'paid' => 0,
            'status' => 'finished'
        ])->first();

        if($unpaidReservation) {
            $stripeUrl = $this->createStripeCheckout($unpaidReservation);
            return response()->json([
                'payment_url' => $stripeUrl,
                'paymentError' => 'You have an unpaid reservation.Please complete the payment before reserving again.'
            ]);
        }

        //check if user already has a reserved place
        $reservationExists = Reservation::where([
            'user_id' => $request->user()->id,
            'status' => 'reserved'
        ])->exists();

        //if yes
        if($reservationExists) {
            return response()->json([
                'error' => 'You already have a reserved place. Please cancel it to reserve a new place.'
            ]);
        }

        //check if user already has parked
        $reservationParked = Reservation::where([
            'user_id' => $request->user()->id,
            'status' => 'parked'
        ])->exists();

        //if yes
        if($reservationParked) {
            return response()->json([
                'error' => 'You have already parked. Please end it to reserve a new place.'
            ]);
        }

        //find the place 
        $place = Place::find($request->place_id);

        if(!$place || $place->status !== 'available') {
            return response()->json([
                'error' => 'Place is not available.'
            ]);
        }

        //use transaction to prevent partial create and update
        DB::transaction(function() use ($place, $request) {
            //store the reservation
            $reservation = Reservation::create([
                'user_id' => $request->user()->id,
                'place_id' => $place->id,
            ]);

            $reservation->place()->update(['status' => 'reserved']);
        });

        //refresh the place to get the updated status
        $place->refresh();

        broadcast(new PlaceStatusUpdated($place))->toOthers();

        return $this->placeResource($place, "Reservation successfully added.");
    }

    /**
     * Cancel a reservation
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return JsonResponse
     */
    public function cancel(Request $request, Reservation $reservation):JsonResponse
    {
        if($response = $this->ensureUserOwnReservation($request, $reservation)) {
            return $response;
        }else {
            //use transaction to prevent partial create and update
            DB::transaction(function() use ($reservation) {
                //store the reservation
                $reservation->update([
                    'status' => 'cancelled',
                ]);

                $reservation->place()->update(['status' => 'available']);
            });
        }

        broadcast(new PlaceStatusUpdated($reservation->place))->toOthers();

        return $this->placeResource($reservation->place, "Reservation successfully cancelled and the place is available.");
    }

    /**
     * Start parking
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return JsonResponse
     */
    public function startParking(Request $request, Reservation $reservation):JsonResponse
    {
        if($response = $this->ensureUserOwnReservation($request, $reservation)) {
            return $response;
        }else {
            //use transaction to prevent partial create and update
            DB::transaction(function() use ($reservation) {
                //store the reservation
                $reservation->update([
                    'status' => 'parked',
                    'start_time' => Carbon::now()
                ]);

                $reservation->place()->update(['status' => 'occupied']);
            });
        }

        broadcast(new PlaceStatusUpdated($reservation->place))->toOthers();

        return $this->placeResource($reservation->place, "Parking started.");
    }

    /**
     * End parking
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return JsonResponse
     */
    public function endParking(Request $request, Reservation $reservation):JsonResponse
    {
        if($response = $this->ensureUserOwnReservation($request, $reservation)) {
            return $response;
        }else {
            //use transaction to prevent partial create and update
            DB::transaction(function() use ($reservation) {
                //store the reservation
                $reservation->update([
                    'status' => 'finished',
                    'end_time' => Carbon::now()
                ]);

                $reservation->place()->update(['status' => 'available']);
            });
        }

        $hours = ceil($reservation->start_time->diffInMinutes($reservation->end_time) / 60);

        $place = $reservation->place;
        $sector = $place->sector;
        $pricePerHour = $sector->price;
        $amount = $hours * $pricePerHour;

        $reservation->update([
            'amount' => $amount
        ]);

        broadcast(new PlaceStatusUpdated($reservation->place))->toOthers();

        return $this->placeResourceWithReservation($reservation->place, $reservation, "Parking ended amount to pay is: $amount dollars for $hours hour(s).");
    }

    /**
     * Check if the user is the owner of the reservation
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return JsonResponse|null
     */
    private function ensureUserOwnReservation(Request $request, Reservation $reservation):?JsonResponse
    {
        if($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'error' => 'No active reservation found.'
            ]);
        }
        return null;
    }

    /**
     * return the place and the message
     *
     * @param Place $place
     * @param string $message
     * @return JsonResponse
     */
    private function placeResource(Place $place, string $message):JsonResponse
    {
        return response()->json([
            'place' => PlaceResource::make($place->load('sector', 'reservations')),
            'message' => $message
        ]);
    }

    /**
     * return the place, reservation and the message
     *
     * @param Place $place
     * @param Reservation $reservation
     * @param string $message
     * @return JsonResponse
     */
    private function placeResourceWithReservation(Place $place, Reservation $reservation, string $message):JsonResponse
    {
        return response()->json([
            'place' => PlaceResource::make($place->load('sector', 'reservations')),
            'reservation' => [
                'id' => $reservation->id,
                'user_id' => $reservation->user_id,
                'place_id' => $reservation->place_id,
                'start_time' => $reservation->start_time,
                'end_time' => $reservation->end_time,
                'status' => $reservation->status,
                'amount' => $reservation->amount,
                'paid' => $reservation->paid,
                'place' => [
                    'place_number' => $reservation->place->place_number,
                    'sector' => [
                        'name' => $reservation->place->sector->name,
                        'price' => $reservation->place->sector->price
                    ]
                ]
            ],
            'message' => $message
        ]);
    }

    /**
     * Pay reservation
     *
     * @param Reservation $reservation
     * @return string
     */
    private function createStripeCheckout(Reservation $reservation):string
    {
        $stripeKey = env('STRIPE_KEY');
        
        // If no Stripe key is set, return a test URL for development
        if (!$stripeKey) {
            return 'http://localhost:5173/pay/test/' . $reservation->id;
        }
        
        Stripe::setApiKey($stripeKey);

        $checkout_session = Session::create([
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Reservation place #'.$reservation->place->place_number
                    ],
                    'unit_amount' => (int) $reservation->amount * 100
                ],
                'quantity' => 1
            ]],
            'mode' => 'payment',
            'success_url' => 'http://localhost:5173/pay/success/?session_id={CHECKOUT_SESSION_ID}&reservation='.$reservation->id
        ]);
        return $checkout_session->url;
    }

    /**
     * Check if payment is done
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request, Reservation $reservation):JsonResponse
    {
        if($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'data' => [
                'id' => $reservation->id,
                'place' => [
                    'place_number' => $reservation->place->place_number,
                    'sector' => [
                        'name' => $reservation->place->sector->name,
                        'price' => $reservation->place->sector->price
                    ]
                ],
                'amount' => $reservation->amount,
                'status' => $reservation->status
            ]
        ]);
    }

    /**
     * Create a payment session for a reservation
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return JsonResponse
     */
    public function createPaymentSession(Request $request, Reservation $reservation):JsonResponse
    {
        if($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 403);
        }

        if($reservation->status !== 'finished') {
            return response()->json([
                'error' => 'Only finished reservations can be paid.'
            ]);
        }

        $stripeUrl = $this->createStripeCheckout($reservation);

        return response()->json([
            'payment_url' => $stripeUrl
        ]);
    }

    /**
     * Check if payment is done
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function paySuccess(Request $request):JsonResponse
    {
        $sessionId = $request->session_id;
        //check if user has already reserved this place
        $unpaidReservation = Reservation::where([
            'id' => $request->reservation_id,
            'user_id' => $request->user_id
        ])->first();
        //if no reservation found
        if(!$unpaidReservation) {
            return response()->json([
                'error' => 'No reservation found.'
            ]);
        }
        //if no session id found
        if(!$sessionId) {
            return response()->json([
                'error' => 'Payment not done successfully try again later.'
            ]);
        }
        //check if stripe id is already used
        if(StripeSession::where('stripe_id', $sessionId)->exists()) {
            return response()->json([
                'error' => 'This session id has already been used.'
            ]);
        }

        $stripeKey = env('STRIPE_KEY');
        
        // If using test session (no Stripe key), accept the payment
        if (!$stripeKey && strpos($sessionId, 'test_session_') === 0) {
            try {
                StripeSession::create([
                    'stripe_id' => $sessionId
                ]);
                $unpaidReservation->paid = 1;
                $unpaidReservation->save();
                return response()->json([
                    'message' => 'Payment is done successfully.'
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => $e->getMessage()
                ]);
            }
        }

        // If Stripe key exists, verify with Stripe
        if ($stripeKey) {
            Stripe::setApiKey($stripeKey);
            try {
                Session::retrieve($sessionId);
                //store the session id to prevent reuse
                StripeSession::create([
                    'stripe_id' => $sessionId
                ]);
                $unpaidReservation->paid = 1;
                $unpaidReservation->save();
                return response()->json([
                    'message' => 'Payment is done successfully.'
                ]);
            } catch (InvalidRequestException $e) {
                return response()->json([
                    'error' => $e->getMessage()
                ]);
            }
        }

        return response()->json([
            'error' => 'Payment method not configured.'
        ]);
    }
}
