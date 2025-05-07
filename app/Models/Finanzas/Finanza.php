<?php

namespace App\Models\Finanzas;

use App\Models\Compras\Compra;
use App\Models\Empresa\Empresa;
use App\Models\Sursales\Sucursal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Finanza extends Model
{
    use HasFactory;

    protected $table = 'finanzas';

    protected $fillable = [
        'fecha_aprobacion',
        'correo',
        'compra_id',
        'empresa_id',
        'sucursal_id',
    ];

    public function compras()
    {
        return $this->belongsTo(Compra::class, 'compra_id');
    }

    public function empresas()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function sucursales(){
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

}
