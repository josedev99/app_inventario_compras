<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use App\Models\Empresa\Empresa;
use App\Models\Inventarios\HistorialMovimiento;
use App\Models\Inventarios\Inventario;
use App\Models\Productos\Producto;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use App\Services\GenerateCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;
use PDF;

class InventarioController extends Controller
{
    public function index()
    {
        $empresaId = Auth::user()->empresa_id;
        $productos = Producto::where('empresa_id', $empresaId)
            ->select('id', 'codigo', DB::raw('CONCAT(codigo, " - ", nombre , " ", Umedida) as descripcion'))
            ->orderBy('nombre')
            ->get();
        return Inertia::render('Inventario/Index', compact('productos'));
    }

    public function indexIngreso()
    {
        $empresaId = Auth::user()->empresa_id;
        $productos = Producto::where('empresa_id', $empresaId)
            ->select('id', 'codigo', DB::raw('CONCAT(codigo, " - ", nombre , " ", Umedida) as descripcion'))
            ->orderBy('id', 'desc')
            ->get();
        return Inertia::render('Inventario/Ingreso', compact('productos'));
    }

    public function getStockInv(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;

        $stocks = DB::table('inventarios as e')
            ->join('productos as p', function ($join) {
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

    //Listar movimientos entradas
    public function getEntradaMov(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;

        $historialIngreso = DB::table('historial_movimientos as hm')
            ->join('users as u', function ($join) {
                $join->on('hm.usuario_id', '=', 'u.id')
                    ->on('hm.empresa_id', '=', 'u.empresa_id');
            })
            ->where('hm.empresa_id', $empresaId)
            ->where('hm.tipo_movimiento', '=', 'ENTRADA')
            ->orderBy('hm.id', 'desc')
            ->groupBy('hm.codigo')
            ->select(
                'hm.id',
                DB::raw('DATE_FORMAT(hm.created_at,"%d/%m/%Y") as fecha'),
                'hm.codigo',
                DB::raw("SUM(hm.cantidad) as cantidad"),
                'u.nombre'
            );

        return DataTables::of($historialIngreso)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function ($q) use ($search) {
                        $q->where('hm.codigo', 'like', "%{$search}%")
                            ->orWhere('u.nombre', 'like', "%{$search}%")
                            ->orWhereRaw("DATE_FORMAT(hm.created_at, '%d/%m/%Y') LIKE ?", ["%{$search}%"]);
                    });
                }
            })
            ->make(true);
    }

    //Obtener el historial de ingreso
    public function getDetalleMov()
    {
        $empresaId = Auth::user()->empresa_id;
        $codigo = request()->get('codigo');

        $detalle = DB::select("select hm.id,hm.cantidad,p.codigo,p.nombre,p.Umedida from historial_movimientos as hm inner join productos as p on hm.producto_id=p.id where hm.codigo = ? and hm.empresa_id = ?", [$codigo, $empresaId]);

        return response()->json($detalle);
    }

    //Realizar la busqueda de productos mediante codigo de compra
    public function getProductCompra(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $codigo = $request->input('codigo');

        $productos = DB::select("select dc.cantidad,dc.producto_id,p.codigo,concat(p.nombre, ' ',p.umedida) as descripcion from compras as c inner join detalle_compras as dc on c.id=dc.compra_id inner join productos as p on dc.producto_id=p.id where c.estado = 'PAGADO' and c.empresa_id = ? and c.codigo = ?", [$empresaId, $codigo]);
        return response()->json($productos);
    }

    public function saveIngreso(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $sucursalId = Auth::user()->sucursal_id;
        $usuario_id = Auth::user()->id;
        try {
            DB::beginTransaction();
            $productos = json_decode($request->input('productos'), true);

            $code_mov = GenerateCode::generarMov("MOV");

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
                    'codigo' => $code_mov,
                    'cantidad' => $cantidad,
                    'precio_unitario' => 0.00,
                    'precio_venta' => 0.00,
                    'tipo_movimiento' => 'ENTRADA',
                    'producto_id' => $productoId,
                    'empresa_id' => $empresaId,
                    'sucursal_id' => $sucursalId,
                    'usuario_id' => $usuario_id
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

    //Generar documento PDF para ingreso a inventario
    public function genPdfMovIngreso($codigo)
    {
        $userId = Auth::user()->id;
        $empresaId = Auth::user()->empresa_id;
        $codigo_mov = base64_decode($codigo);

        $sucursal = Sucursal::where('empresa_id', $empresaId)->select('nombre', 'logo')->first();
        $empresa = Empresa::where('id', $empresaId)->first();

        $user = User::where('id', $userId)->first();

        $detalle_mov = DB::select("select hm.id,DATE_FORMAT(hm.created_at,'%d/%m/%Y') as fecha,hm.cantidad,p.codigo,p.nombre,p.Umedida from historial_movimientos as hm inner join productos as p on hm.producto_id=p.id where hm.codigo = ? and hm.empresa_id = ?", [$codigo_mov, $empresaId]);

        if (count($detalle_mov) > 0) {
            $fecha_mov = $detalle_mov[0]->fecha;
        } else {
            $fecha_mov = '';
        }

        $pdf = PDF::loadView('pdf.movIngresoInv', compact('detalle_mov', 'sucursal', 'empresa', 'user', 'fecha_mov', 'codigo_mov'));
        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream(date('d-m-Y') . "_ingreso_" . $codigo_mov . ".pdf");
    }


    //vista para salidas de invenatrios
    public function indexMovSalidas()
    {
        $empresaId = Auth::user()->empresa_id;
        $productos = Producto::where('empresa_id', $empresaId)
            ->select('id', 'codigo', DB::raw('CONCAT(codigo, " - ", nombre , " ", Umedida) as descripcion'))
            ->orderBy('id', 'desc')
            ->get();
        return Inertia::render('Inventario/Salida', compact('productos'));
    }

    //listar historial movimiento salidas
    public function getSalidaMov(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;

        $historialSalida = DB::table('historial_movimientos as hm')
            ->join('users as u', function ($join) {
                $join->on('hm.usuario_id', '=', 'u.id')
                    ->on('hm.empresa_id', '=', 'u.empresa_id');
            })
            ->where('hm.empresa_id', $empresaId)
            ->where('hm.tipo_movimiento', '=', 'SALIDA')
            ->orderBy('hm.id', 'desc')
            ->groupBy('hm.codigo')
            ->select(
                'hm.id',
                DB::raw('DATE_FORMAT(hm.created_at,"%d/%m/%Y") as fecha'),
                'hm.codigo',
                DB::raw("SUM(hm.cantidad) as cantidad"),
                'u.nombre'
            );

        return DataTables::of($historialSalida)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function ($q) use ($search) {
                        $q->where('hm.codigo', 'like', "%{$search}%")
                            ->orWhere('u.nombre', 'like', "%{$search}%")
                            ->orWhereRaw("DATE_FORMAT(hm.created_at, '%d/%m/%Y') LIKE ?", ["%{$search}%"]);
                    });
                }
            })
            ->make(true);
    }

    //guardamos el detalle de la salida
    public function saveSalida(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $sucursalId = Auth::user()->sucursal_id;
        $usuario_id = Auth::user()->id;

        try {
            DB::beginTransaction();

            /* Decodificamos productos, puede venir JSON o array directamente */
            $productos = json_decode($request->input('productos'), true);

            /* Validar que productos sea un array no vacío */
            if (!is_array($productos) || empty($productos)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se recibieron productos válidos para procesar la salida.',
                ], 422);
            }

            $code_mov = GenerateCode::generarMov("MOV");

            foreach ($productos as $index => $producto) {
                /* Validar que cada producto tenga 'id' y 'cantidad' */
                if (!isset($producto['id']) || !isset($producto['cantidad'])) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "Faltan datos obligatorios (id o cantidad) en el producto índice {$index}.",
                    ], 422);
                }

                $productoId = $producto['id'];
                $cantidad = $producto['cantidad'];
                $precio = 0; // Si quieres obtener el precio real, debes traerlo

                /**
                 * Buscamos producto en inventario
                 */
                $existsInv = Inventario::where('producto_id', $productoId)
                    ->where('empresa_id', $empresaId)
                    ->first();

                if (!$existsInv) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "El producto con ID {$productoId} no existe en el inventario.",
                    ], 422);
                }

                /**
                 * Verificamos stock suficiente
                 */
                if ($existsInv->cantidad < $cantidad) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "Stock insuficiente para el producto ID {$productoId}. Cantidad disponible: {$existsInv->cantidad}.",
                    ], 422);
                }

                /**
                 * 
                 * Reducimos la  cantidad en inventario
                 */
                $existsInv->decrement('cantidad', $cantidad);
                $existsInv->update(['precio_venta' => $precio]);

                /**
                 * Guardamos el historial del movimiento
                 */
                HistorialMovimiento::create([
                    'codigo' => $code_mov,
                    'cantidad' => $cantidad,
                    'precio_unitario' => 0.00,
                    'precio_venta' => 0.00,
                    'tipo_movimiento' => 'SALIDA',
                    'producto_id' => $productoId,
                    'empresa_id' => $empresaId,
                    'sucursal_id' => $sucursalId,
                    'usuario_id' => $usuario_id
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Salida registrada correctamente.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Error al registrar la salida: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function genPdfMovSalida($codigo)
    {
        $userId = Auth::user()->id;
        $empresaId = Auth::user()->empresa_id;
        $codigo_mov = base64_decode($codigo);

        $sucursal = Sucursal::where('empresa_id', $empresaId)->select('nombre', 'logo')->first();
        $empresa = Empresa::where('id', $empresaId)->first();

        $user = User::where('id', $userId)->first();

        $detalle_mov = DB::select("select hm.id,DATE_FORMAT(hm.created_at,'%d/%m/%Y') as fecha,hm.cantidad,p.codigo,p.nombre,p.Umedida from historial_movimientos as hm inner join productos as p on hm.producto_id=p.id where hm.codigo = ? and hm.empresa_id = ?", [$codigo_mov, $empresaId]);

        if (count($detalle_mov) > 0) {
            $fecha_mov = $detalle_mov[0]->fecha;
        } else {
            $fecha_mov = '';
        }

        $pdf = PDF::loadView('pdf.movSalidaInv', compact('detalle_mov', 'sucursal', 'empresa', 'user', 'fecha_mov', 'codigo_mov'));
        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream(date('d-m-Y') . "_ingreso_" . $codigo_mov . ".pdf");
    }
}
