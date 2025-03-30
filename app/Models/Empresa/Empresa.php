<?php

namespace App\Models\Empresa;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';

    protected $fillable = [
        'nombre',
        'nit',
        'nrc',
        'giro',
        'direccion',
        'telefono',
        'user_id',
    ];

    public function users(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
