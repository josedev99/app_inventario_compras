<?php

namespace App\Models\Productos;

use App\Models\Categorias\Categoria;
use App\Models\Empresa\Empresa;
use App\Models\Proveedores\Proveedor;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'Umedida',
        'costo',
        'codigo',
        'empresa_id',
        'sucursal_id',
        'user_id',
        'categoria_id'
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

    public function proveedores()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function categorias(){
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }
}
