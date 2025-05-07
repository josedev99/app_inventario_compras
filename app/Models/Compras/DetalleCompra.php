<?php

namespace App\Models\Compras;

use App\Models\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleCompra extends Model
{
    use HasFactory;

    protected $table = 'detalle_compras';

    protected $fillable = [
        'compra_id',
        'costo_unitario',
        'cantidad',
        'total',
        'producto_id',
    ];

    public function compras()
    {
        return $this->belongsTo(Compra::class, 'compra_id');
    }

    public function productos()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
