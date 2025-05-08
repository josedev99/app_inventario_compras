<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use App\Models\Inventarios\HistorialMovimiento;
use App\Models\Inventarios\Inventario;
use App\Models\Productos\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class InventarioController extends Controller
{
    public function index()
    {
        $empresaId = Auth::user()->empresa_id;
        $productos = Producto::where('empresa_id', $empresaId)
            ->select('id','codigo', DB::raw('CONCAT(codigo, " - ", nombre , " ", Umedida) as descripcion'))
            ->orderBy('nombre')
            ->get();
        return Inertia::render('Inventario/Index', compact('productos'));
    }

    public function indexIngreso(){
        $empresaId = Auth::user()->empresa_id;
        $productos = Producto::where('empresa_id', $empresaId)
            ->select('id','codigo', DB::raw('CONCAT(codigo, " - ", nombre , " ", Umedida) as descripcion'))
            ->orderBy('id','desc')
            ->get();
        return Inertia::render('Inventario/Ingreso', compact('productos'));
    }

    public function getStockInv(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;

        $stocks = DB::table('inventarios as e')
            ->join('productos as p', function($join) {
                $join->on('e.producto_id', '=', 'p.id')
                    ->on('e.empresa_id', '=', 'p.empresa_id');
            })
            ->where('e.empresa_id', $empresaId)
            ->groupBy('e.producto_id', 'e.precio_venta', 'p.codigo', 'p.nombre', 'p.Umedida', 'e.id')
            ->select(
                'e.id',
                DB::raw('SUM(e.cantidad) as stock'),
                'e.precio_venta',
                'p.codigo',
                'p.nombre as descripcion',
                'p.Umedida'
            );

        return DataTables::of($stocks)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function ($q) use ($search) {
                        $q->where('p.codigo', 'like', "%{$search}%")
                        ->orWhere('p.nombre', 'like', "%{$search}%")
                        ->orWhere('p.Umedida', 'like', "%{$search}%");
                    });
                }
            })
            ->make(true);
    }

    //Listar movimientos
    public function getEntradaStock(Request $request){
        $empresaId = Auth::user()->empresa_id;

        $historialIngreso = DB::table('historial_movimientos as hm')
            ->join('productos as p', function($join) {
                $join->on('hm.producto_id', '=', 'p.id')
                    ->on('hm.empresa_id', '=', 'p.empresa_id');
            })
            ->where('hm.empresa_id', $empresaId)
            ->orderBy('hm.id','desc')
            ->select(
                'hm.id',
                DB::raw('DATE_FORMAT(hm.created_at,"%d/%m/%Y") as fecha'),
                'p.codigo',
                'p.nombre as descripcion',
                'p.Umedida',
                'hm.cantidad'
            );

        return DataTables::of($historialIngreso)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function ($q) use ($search) {
                        $q->where('p.codigo', 'like', "%{$search}%")
                        ->orWhere('p.nombre', 'like', "%{$search}%")
                        ->orWhere('p.Umedida', 'like', "%{$search}%");
                    });
                }
            })
            ->make(true);
    }

    //Realizar la busqueda de productos mediante codigo de compra
    public function getProductCompra(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $codigo = $request->input('codigo');

        $productos = DB::select("select dc.cantidad,dc.producto_id,p.codigo,concat(p.nombre, ' ',p.umedida) as descripcion from compras as c inner join detalle_compras as dc on c.id=dc.compra_id inner join productos as p on dc.producto_id=p.id where c.estado = 'PAGADO' and c.empresa_id = ? and c.codigo = ?",[$empresaId,$codigo]);
        return response()->json($productos);
    }

    public function saveIngreso(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $sucursalId = Auth::user()->sucursal_id;
        try {
            DB::beginTransaction();
            $productos = json_decode($request->input('productos'), true);

            foreach ($productos as $producto) {
                $productoId = $producto['id'];
                $cantidad = $producto['cantidad'];
                $precio = 0;

                // Verificar si el producto ya existe en el inventario
                $existsInv = Inventario::where('producto_id', $productoId)->where('empresa_id', $empresaId)->first();

                if ($existsInv) {
                    // Actualizar la cantidad existente
                    $existsInv->increment('cantidad', $cantidad);
                    $existsInv->update(['precio_venta' => $precio]);
                    $existsInv->save();
                } else {
                    Inventario::create([
                        'cantidad' => $cantidad,
                        'precio_venta' => $precio,
                        'producto_id' => $productoId,
                        'empresa_id' => $empresaId,
                        'sucursal_id' => 1, // Cambiar por el ID de la sucursal correspondiente
                    ]);
                }
                //Guardar historial
                HistorialMovimiento::create([
                    'cantidad' => $cantidad,
                    'precio_unitario' => 0.00,
                    'precio_venta' => 0.00,
                    'tipo_movimiento' => 'ENTRADA',
                    'producto_id' => $productoId,
                    'empresa_id' => $empresaId,
                    'sucursal_id' => $sucursalId,
                ]);
            }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Ingreso registrado correctamente',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error al registrar el ingreso: ' . $e->getMessage(),
            ], 500);
        }
        
    }
}
