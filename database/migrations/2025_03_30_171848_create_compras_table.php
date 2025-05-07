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
        Schema::create('compras', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('fecha_compra');
            $table->integer('proveedor_id')->unsigned();
            $table->integer('empresa_id')->unsigned();
            $table->integer('sucursal_id')->unsigned();
            $table->enum('estado', ['PAGADO', 'PENDIENTE', 'CANCELADO'])->default('PENDIENTE');
            $table->text('codigo');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();

            $table->foreign('proveedor_id')->references('id')->on('proveedors');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
            $table->foreign('sucursal_id')->references('id')->on('sucursals')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
