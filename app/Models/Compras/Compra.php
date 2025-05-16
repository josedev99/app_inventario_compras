<?php

namespace App\Models\Compras;

use App\Models\Empresa\Empresa;
use App\Models\Proveedores\Proveedor;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $table = 'compras';

    protected $fillable = [
        'nombre',
        'fecha_compra',
        'proveedor_id',
        'empresa_id',
        'sucursal_id',
        'estado',
        'codigo',
        'pedido_id',
        'user_id',
        'enviado_a_finanzas'
    ];

    protected $casts = [
        'enviado_a_finanzas' => 'boolean',
    ];


    public function empresas()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function sucursales()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleCompra::class, 'compra_id');
    }

    public function proveedores()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public static function getData()
    {
        $data = Compra::join('empresas as m', 'm.id', '=', 'compras.empresa_id')
            ->join('sucursals as s', 's.id', '=', 'compras.sucursal_id')
            ->join('users as u', 'u.id', '=', 'compras.user_id')
            ->join('proveedors as p', 'p.id', '=', 'compras.proveedor_id')
            ->leftJoin('pedidos as pe', 'pe.id', '=', 'compras.pedido_id')
            ->select(
                'compras.*',
                'm.nombre as empresa',
                's.nombre as sucursal',
                'u.nombre as usuario',
                'p.nombre as proveedor',
                'pe.estado as pedido_estado'
            )
            ->orderBy('compras.id', 'desc')
            ->get();

        return $data;
    }
}
