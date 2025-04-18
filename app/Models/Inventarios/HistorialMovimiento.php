<?php

namespace App\Models\Inventarios;

use App\Models\Empresa\Empresa;
use App\Models\Productos\Producto;
use App\Models\Sursales\Sucursal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialMovimiento extends Model
{
    use HasFactory;

    protected $table = 'historial_movimientos';

    protected $fillable = [
        'cantidad',
        'precio_unitario',
        'precio_venta',
        'tipo_movimiento',
        'producto_id',
        'empresa_id',
        'sucursal_id',
    ];

    public function productos()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function empresas()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function sucursales(){
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }
}
