<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analytics', function (Blueprint $table) {
            $table->id();
            $table->string('metric_type'); // occupation_rate, revenue, duration, etc.
            $table->string('period_type')->default('daily'); // hourly, daily, weekly, monthly
            $table->decimal('value', 10, 2);
            $table->json('metadata')->nullable(); // Additional data
            $table->date('date');
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['metric_type', 'date']);
            $table->index('period_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics');
    }
};
