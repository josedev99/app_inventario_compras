<?php

namespace App\Http\Controllers\Producto;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Categorias\Categoria;
use App\Models\Inventarios\Inventario;
use App\Models\Productos\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class ProductoController extends Controller
{
    public function index(){
        $categorias = Categoria::select('id','nombre')->get();
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

    public function getProducosAll(Request $request){
        $empresaId = Auth::user()->empresa_id;
        $productos = DB::table('productos as p')
        ->leftJoin('categorias as c', 'p.categoria_id', '=', 'c.id')
        ->where('p.empresa_id', $empresaId)
        ->select(
            'p.id',
            'p.codigo',
            'p.nombre',
            'p.uMedida',
            'p.costo as costoUnit',
            'c.nombre as categoria',
            'p.empresa_id',
            'p.sucursal_id',
            'p.categoria_id'
        )->orderBy('p.id','desc');

        return DataTables::of($productos)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function($q) use ($search) {
                        $q->where('p.codigo', 'like', "%{$search}%")
                        ->orWhere('p.nombre', 'like', "%{$search}%")
                        ->orWhere('p.uMedida', 'like', "%{$search}%")
                        ->orWhere('c.categoria', 'like', "%{$search}%");
                    });
                }
            })
            ->make(true);
    }

    public function update(ProductRequest $request){
        $empresaId = Auth::user()->empresa_id;
        $okUpdate =  Producto::where('id', request()->get('id'))->where('empresa_id',$empresaId)->update([
            'nombre' => $request['nombre'],
            'Umedida' => $request['uMedida'],
            'costo' => $request['costoUnit'],
            'codigo' => $request['codigo'],
            'categoria_id' => $request['categoria_id']
        ]);

        if($okUpdate){
            return response()->json([
                'status' => 'success',
                'message' => 'El producto se ha actualizado con éxito.'
            ]);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Ha ocurrido un error al actualizar el producto.'
        ]);
    }

    public function destroy(){
        $empresaId = Auth::user()->empresa_id;
        $productoId = request('id', 0);

        // Validar si el producto existe en el inventario de la empresa
        $existsInv = Inventario::where('producto_id', $productoId)
            ->where('empresa_id', $empresaId)
            ->exists();

        if ($existsInv) {
            return response()->json([
                'status' => 'error',
                'message' => 'Este producto no puede eliminarse porque ya está registrado en el inventario.'
            ]);
        }

        // Validar si el producto ha sido utilizado en alguna compra
        $existsCompra = DB::table('compras as c')
            ->join('detalle_compras as dc', 'c.id', '=', 'dc.compra_id')
            ->where('dc.producto_id', $productoId)
            ->exists();

        if ($existsCompra) {
            return response()->json([
                'status' => 'error',
                'message' => 'Este producto no puede eliminarse porque ya ha sido utilizado en una compra.'
            ]);
        }

        $okUpdate = Producto::where('id', $productoId)->where('empresa_id',$empresaId)->delete();

        if($okUpdate){
            return response()->json([
                'status' => 'success',
                'message' => 'El producto se ha eliminado con éxito.'
            ]);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Ha ocurrido un error al intentar eliminar el producto.'
        ]);
    }
}
