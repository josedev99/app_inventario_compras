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
            return response()->json([
                'status' => 'success',
                'message' => 'El producto se ha creado exitosamente.',
                'producto' => $producto
            ]);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'No se pudo crear el producto. Por favor, intenta de nuevo.'
        ]);
    }

    public function getProductos(Request $request){
        $productos = Producto::all();
        $data = $productos->map(function ($producto) {
            return [
                'id' => $producto->id,
                'empresa_id' => $producto->empresa_id,
                'sucursal_id' => $producto->sucursal_id,
                'codigo' => $producto->codigo,
                'nombre' => $producto->nombre,
                'unidad_medida' => $producto->Umedida,
                'costo' => "$" . number_format($producto->costo, 2, '.', ''),
                'categoria' => $producto->categoria->nombre ?? '',
            ];
        });
    
        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $data->count(),
            'recordsFiltered' => $data->count(),
            'data' => $data,
        ]);
    }
}
