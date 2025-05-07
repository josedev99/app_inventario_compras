<?php

namespace App\Models\Entregas;

use App\Models\Empresa\Empresa;
use App\Models\Productos\Producto;
use App\Models\Sursales\Sucursal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleEntrega extends Model
{
    use HasFactory;

    protected $fillable = [
        'entrega_id',
        'producto_id',
        'user_id',
        'empresa_id',
        'sucursal_id',
        'cantidad',
        'categoria',
        'descripcion',
    ];

    public function entregas()
    {
        return $this->belongsTo(Entrega::class, 'entrega_id');
    }

    public function empresas()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function sucursales(){
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    public function productos()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
