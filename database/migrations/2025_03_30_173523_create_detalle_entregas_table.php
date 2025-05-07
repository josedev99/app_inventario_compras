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
        Schema::create('detalle_entregas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('entrega_id')->unsigned();
            $table->integer('producto_id')->unsigned();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->integer('empresa_id')->unsigned();
            $table->integer('sucursal_id')->unsigned();
            $table->integer('cantidad');
            $table->string('categoria');
            $table->text('descripcion');
            $table->timestamps();


            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
            $table->foreign('sucursal_id')->references('id')->on('sucursals')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_entregas');
    }
};
