<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Place;
use App\Models\Reservation;
use App\Services\QRCodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class QRCodeTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $place;
    protected $reservation;
    protected $qrCodeService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user
        $this->user = User::factory()->create([
            'email' => 'test@parking.com',
            'password' => bcrypt('password123')
        ]);

        // Create test place
        $this->place = Place::factory()->create([
            'place_number' => 'A-15',
            'status' => 'available'
        ]);

        // Create test reservation
        $this->reservation = Reservation::factory()->create([
            'user_id' => $this->user->id,
            'place_id' => $this->place->id,
            'status' => 'reserved',
            'start_time' => now()->addHours(1),
            'end_time' => now()->addHours(3),
            'amount' => 50.00
        ]);

        $this->qrCodeService = new QRCodeService();
    }

    /** @test */
    public function it_can_generate_unique_qr_code_token()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $this->assertNotNull($token);
        $this->assertEquals(32, strlen($token));
        $this->assertTrue(Cache::has("qr_code:{$token}"));
    }

    /** @test */
    public function it_stores_qr_code_token_in_reservation()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $this->reservation->refresh();
        $this->assertEquals($token, $this->reservation->qr_code_token);
    }

    /** @test */
    public function it_caches_reservation_data_with_token()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $cachedData = Cache::get("qr_code:{$token}");

        $this->assertNotNull($cachedData);
        $this->assertEquals($this->reservation->id, $cachedData['reservation_id']);
        $this->assertEquals($this->user->id, $cachedData['user_id']);
        $this->assertEquals($this->place->id, $cachedData['place_id']);
    }

    /** @test */
    public function it_can_verify_valid_qr_code()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $result = $this->qrCodeService->verifyQRCode($token);

        $this->assertTrue($result['success']);
        $this->assertEquals($this->reservation->id, $result['reservation']->id);
    }

    /** @test */
    public function it_fails_to_verify_invalid_qr_code()
    {
        $result = $this->qrCodeService->verifyQRCode('invalid_token_12345678901234567890');

        $this->assertFalse($result['success']);
        $this->assertEquals('QR Code invalide ou expiré', $result['message']);
    }

    /** @test */
    public function it_can_check_in_with_valid_qr_code()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $result = $this->qrCodeService->checkIn($token);

        $this->assertTrue($result['success']);
        $this->assertEquals('Check-in réussi', $result['message']);
        
        $this->reservation->refresh();
        $this->assertNotNull($this->reservation->checked_in_at);
        $this->assertEquals('parked', $this->reservation->status);
    }

    /** @test */
    public function it_prevents_double_check_in()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);
        
        // First check-in
        $this->qrCodeService->checkIn($token);
        
        // Second check-in attempt
        $result = $this->qrCodeService->checkIn($token);

        $this->assertFalse($result['success']);
        $this->assertEquals('Déjà enregistré', $result['message']);
    }

    /** @test */
    public function it_can_check_out_after_check_in()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);
        
        // Check-in first
        $this->qrCodeService->checkIn($token);
        
        // Then check-out
        $result = $this->qrCodeService->checkOut($token);

        $this->assertTrue($result['success']);
        $this->assertEquals('Check-out réussi', $result['message']);
        
        $this->reservation->refresh();
        $this->assertNotNull($this->reservation->checked_out_at);
        $this->assertEquals('finished', $this->reservation->status);
    }

    /** @test */
    public function it_calculates_additional_fees_on_checkout()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);
        
        // Simulate check-in 3 hours ago
        $this->reservation->update([
            'checked_in_at' => now()->subHours(3),
            'status' => 'parked'
        ]);

        // Check-out now (1 hour overtime if reserved for 2 hours)
        $result = $this->qrCodeService->checkOut($token);

        $this->assertTrue($result['success']);
        $this->assertArrayHasKey('additional_fees', $result);
        $this->assertArrayHasKey('actual_duration', $result);
    }

    /** @test */
    public function authenticated_user_can_generate_qr_code()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/qrcode/reservation/{$this->reservation->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'qr_code',
                'qr_code_image',
                'reservation_id',
                'place_number',
                'sector_name',
                'start_time',
                'end_time',
                'status',
                'user_name',
                'vehicle_info',
                'total_price',
                'generated_at'
            ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_generate_qr_code()
    {
        $response = $this->getJson("/api/qrcode/reservation/{$this->reservation->id}");

        $response->assertStatus(401);
    }

    /** @test */
    public function user_cannot_access_other_users_qr_code()
    {
        $otherUser = User::factory()->create();

        $response = $this->actingAs($otherUser, 'sanctum')
            ->getJson("/api/qrcode/reservation/{$this->reservation->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function qr_code_image_is_svg_format()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/qrcode/reservation/{$this->reservation->id}");

        $qrCodeImage = $response->json('qr_code_image');

        $this->assertStringStartsWith('data:image/svg+xml;base64,', $qrCodeImage);
    }

    /** @test */
    public function it_reuses_existing_qr_code_token()
    {
        // Generate first time
        $firstResponse = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/qrcode/reservation/{$this->reservation->id}");
        
        $firstToken = $firstResponse->json('qr_code');

        // Generate second time
        $secondResponse = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/qrcode/reservation/{$this->reservation->id}");
        
        $secondToken = $secondResponse->json('qr_code');

        $this->assertEquals($firstToken, $secondToken);
    }

    /** @test */
    public function it_can_verify_qr_code_via_api()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/qrcode/verify', [
                'qr_code' => $token
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ])
            ->assertJsonStructure([
                'success',
                'reservation',
                'place',
                'user'
            ]);
    }

    /** @test */
    public function it_can_check_in_via_api()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/qrcode/check-in', [
                'qr_code' => $token
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Check-in réussi'
            ]);
    }

    /** @test */
    public function it_can_check_out_via_api()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);
        
        // Check-in first
        $this->qrCodeService->checkIn($token);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/qrcode/check-out', [
                'qr_code' => $token
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Check-out réussi'
            ]);
    }

    /** @test */
    public function it_validates_qr_code_field_is_required()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/qrcode/verify', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['qr_code']);
    }

    /** @test */
    public function qr_code_status_is_mapped_correctly()
    {
        // Test status mapping
        $this->reservation->update(['status' => 'reserved']);
        
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/qrcode/reservation/{$this->reservation->id}");

        $response->assertStatus(200)
            ->assertJson(['status' => 'confirmed']);
    }

    /** @test */
    public function it_frees_place_on_checkout()
    {
        $token = $this->qrCodeService->generateQRCode($this->reservation);
        
        // Set place as occupied
        $this->place->update(['status' => 'occupied']);
        
        // Check-in
        $this->reservation->update([
            'checked_in_at' => now(),
            'status' => 'parked'
        ]);

        // Check-out
        $this->qrCodeService->checkOut($token);

        $this->place->refresh();
        $this->assertEquals('available', $this->place->status);
    }
}
