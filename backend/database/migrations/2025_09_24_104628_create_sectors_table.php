<?php

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
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description');
            $table->decimal('price', 8, 2);
            $table->timestamps();
        });

        //insert sectors
        Sector::insert([
            [
                'name' => 'A','description' => 'Near entrance', 'price' => 5.00
            ],
            [
                'name' => 'B','description' => 'Middle area', 'price' => 3.50
            ],
            [
                'name' => 'C','description' => 'Far end', 'price' => 2.00
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sectors');
    }
};
