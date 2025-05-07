<?php

namespace App\Models\Entregas;

use App\Models\Proveedores\Proveedor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrega extends Model
{
    use HasFactory;

    protected $table = 'entregas';

    protected $fillable = [
        'estado',
        'fecha_entrega',
        'proveedor_id',
    ];

    public function proveedores(){
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }
}
