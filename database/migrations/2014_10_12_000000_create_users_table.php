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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nombre',150);
            $table->string('direccion',150);
            $table->string('telefono',15)->nullable();
            $table->string('email')->unique();
            $table->string('usuario',50);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('passwordShow',250);
            $table->string('categoria',50);
            $table->unsignedBigInteger('empresa_id')->nullable();
            $table->unsignedBigInteger('sucursal_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
