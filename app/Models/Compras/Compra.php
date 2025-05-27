<?php

namespace App\Models\Compras;

use App\Models\Empresa\Empresa;
use App\Models\Pedido;
use App\Models\Proveedores\Proveedor;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        'tipo_comprobante',
        'pedido_id',
        'user_id',
        'enviado_a_finanzas',
        'tiempo_transcurrido'
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
        $data = DB::table('pedidos as pe')
            ->leftJoin('compras', 'pe.id', '=', 'compras.pedido_id')
            ->leftJoin('empresas as m', 'm.id', '=', 'compras.empresa_id')
            ->leftJoin('sucursals as s', 's.id', '=', 'compras.sucursal_id')
            ->leftJoin('users as u', 'u.id', '=', 'compras.user_id')
            ->leftJoin('proveedors as p', 'p.id', '=', 'compras.proveedor_id')
            ->where('pe.estado_envio', 1)
            ->select(
                DB::raw('COALESCE(compras.id, pe.id) as id'),
                DB::raw('COALESCE(compras.codigo, "") as codigo'),
                DB::raw('COALESCE(compras.nombre, pe.nombre) as nombre'),
                DB::raw('COALESCE(DATE_FORMAT(compras.fecha_compra, "%d/%m/%Y"), DATE_FORMAT(pe.created_at, "%d/%m/%Y")) as fecha_compra'),
                DB::raw('COALESCE(compras.pedido_id, pe.id) as pedido_id'),
                DB::raw('COALESCE(compras.estado, "Solicitud") as estado'),
                DB::raw('COALESCE(s.nombre, "") as sucursal'),
                DB::raw('COALESCE(u.nombre, "") as usuario'),
                DB::raw('COALESCE(p.nombre, "") as proveedor'),
                DB::raw('COALESCE(pe.estado, "") as pedido_estado')
            )
            ->orderBy('compras.id', 'desc')
            ->get();

        return $data;
    }
}
