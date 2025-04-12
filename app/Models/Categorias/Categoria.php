<?php

namespace App\Models\Categorias;

use App\Models\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public static function getCategories()
    {
        $data = Categoria::select(['id', 'nombre', 'descripcion']);
        return  $data;
    }

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}
