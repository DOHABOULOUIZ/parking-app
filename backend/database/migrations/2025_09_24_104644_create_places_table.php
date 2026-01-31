<?php

use App\Models\Place;
use App\Models\Sector;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->constrained()->cascadeOnDelete();
            $table->string('place_number'); 
            $table->enum('status', ['available', 'reserved', 'occupied'])->default('available');
            $table->timestamps();
        });

        //insert places
        $placesPerSector = 10;

        $sectors = Sector::all();

        $placeData = [];

        foreach($sectors as $sector) {
            for($i = 1; $i <= $placesPerSector; $i++) {
                $placeData[] = [
                    'sector_id' => $sector->id,
                    'place_number' => $sector->name.'-'.$i
                ];
            }
        }

        Place::insert($placeData);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
