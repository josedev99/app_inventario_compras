<?php

namespace App\Models\Sucursales;

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

    // Relación con la empresa (singular)
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    // Relación con el usuario (singular)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
