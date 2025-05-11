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
        Schema::table('historial_movimientos', function (Blueprint $table) {
            $table->unsignedBigInteger('usuario_id')->after('sucursal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_movimientos', function (Blueprint $table) {
            $table->dropColumn('usuario_id');
        });
    }
};
