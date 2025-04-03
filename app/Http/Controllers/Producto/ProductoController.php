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
        $empresaId = Auth::user()->empresa_id;
        $sucursalId = Auth::user()->sucursal_id;
        //En desarrollo
        $producto = Producto::create([
            'nombre' => $request['nombre'],
            'Umedida' => $request['uMedida'],
            'costo' => $request['costoUnit'],
            'codigo' => $request['codigo'],
            'empresa_id' => $empresaId,
            'sucursal_id' => $sucursalId,
            'user_id' => $userId ,
            'categoria_id' => $request['categoria_id']
        ]);

        if ($producto) {
            return back()->with('success','El producto se ha creado exitosamente.');
        }
        return back()->with('error','No se pudo crear el producto. Por favor, intenta de nuevo.');
    }

    public function getProductos(){
        $productos = Producto::all();
        return response()->json($productos);
    }
}
