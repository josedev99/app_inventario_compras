<?php

namespace App\Models\Proveedores;

use App\Models\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedors';

    protected $fillable = [
        'nombre'
    ];

    public static function getProveedores()
    {
        $data = Proveedor::select(['id', 'nombre']);
        return  $data;
    }
}
