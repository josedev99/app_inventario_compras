<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;
    protected $fillable = [
        'codigo',
        'nombre',
        'estado',
        'estado_envio',
        'empresa_id',
        'sucursal_id',
        'user_id',
    ];
}
