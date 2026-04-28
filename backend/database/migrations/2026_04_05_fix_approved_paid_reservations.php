<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Approuver automatiquement les réservations qui ont déjà été payées
        // (avant l'ajout de la colonne is_approved)
        DB::table('reservations')
            ->where('paid', true)
            ->update(['is_approved' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset approvals for previously paid reservations back to false if needed
        DB::table('reservations')
            ->where('paid', true)
            ->update(['is_approved' => false]);
    }
};
