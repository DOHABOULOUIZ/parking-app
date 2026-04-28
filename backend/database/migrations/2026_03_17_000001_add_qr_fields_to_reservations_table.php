<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('qr_code_token')->nullable()->after('status');
            $table->timestamp('checked_in_at')->nullable()->after('qr_code_token');
            $table->timestamp('checked_out_at')->nullable()->after('checked_in_at');
        });
    }

    public function down()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['qr_code_token', 'checked_in_at', 'checked_out_at']);
        });
    }
};
