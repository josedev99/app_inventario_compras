<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetPedido extends Model
{
    use HasFactory;
    protected $fillable = [
        'cantidad',
        'producto_id',
        'pedido_id',
        'empresa_id',
    ];
}
