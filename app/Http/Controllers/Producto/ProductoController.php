<?php

namespace App\Http\Controllers\Producto;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Categorias\Categoria;
use App\Models\Productos\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(){
        $categorias = Categoria::all();
        return Inertia::render('Producto/Index', compact('categorias'));
    }

    public function save(ProductRequest $request){
        $userId = Auth::user()->id;
        return request()->all();
        //En desarrollo
        Producto::create([
            'nombre' => $request['nombre'],
            'Umedida' => $request['uMedida'],
            'costo' => $request['costoUnit'],
            'codigo' => $request['codigo'],
            'empresa_id' => 1,
            'sucursal_id' => 1,
            'user_id' => $userId ,
            'categoria_id' => $request['categoria']
        ]);
    }
}
