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
        Schema::table('categorias', function (Blueprint $table) {
            $table->string('codigo',50)->after('nombre')->nullable()->default('');
            $table->unique('codigo', 'categorias_codigo_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropUnique('categorias_codigo_unique');
            $table->dropColumn('codigo');
        });
    }
};
