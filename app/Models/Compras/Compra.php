<?php

namespace App\Models\Compras;

use App\Models\Empresa\Empresa;
use App\Models\Sursales\Sucursal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $table = 'compras';

    protected $fillable = [
        'fecha_compra',
        'proveedor_id',
        'empresa_id',
        'sucursal_id',
        'estado',
        'codigo',
        'user_id',
    ];

    public function empresas()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function sucursales(){
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    public function users(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
