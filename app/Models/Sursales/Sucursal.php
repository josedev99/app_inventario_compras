<?php

namespace App\Models\Sursales;

use App\Models\Empresa\Empresa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    use HasFactory;

    protected $table = 'sucursals';

    protected $fillable = [
        'nombre',
        'direccion',
        'logo',
        'encargado',
        'empresa_id',
        'telefono',
        'correo',
        'bodega',
        'user_id',
    ];

    public function empresas(){
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
