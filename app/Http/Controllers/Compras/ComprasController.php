<?php

namespace App\Http\Controllers\Compras;

use App\Exports\CompraDetallesExport;
use App\Http\Controllers\Controller;
use App\Models\Compras\Compra;
use App\Models\Compras\DetalleCompra;
use App\Models\Empresa\Empresa;
use App\Models\Inventarios\HistorialMovimiento;
use App\Models\Inventarios\Inventario;
use App\Models\Pedido;
use App\Models\Productos\Producto;
use App\Models\Proveedores\Proveedor;
use App\Models\Sucursales\Sucursal;
use Carbon\Carbon;
//use Barryvdh\DomPDF\Facade\Pdf;
use PDF;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Yajra\DataTables\Facades\DataTables;

class ComprasController extends Controller
{
    public function index()
    {
        return Inertia::render('Compras/Index', [
            'proveedores' => Proveedor::select('id', 'nombre')->get(),
            'pedidos' => Pedido::select('id', 'nombre', DB::raw('DATE_FORMAT(created_at,"%d/%m/%Y") as fecha'))->whereIn('estado', ['Pendiente'])->get(),
            'sucursales' => Sucursal::select('id', 'nombre')->get(),
        ]);
    }


    public function getDataCompras(Request $request)
    {
        if ($request->ajax()) {
            $compras = Compra::getData();
            return DataTables::of($compras)->addIndexColumn()
                ->filter(function ($query) use ($request) {
                    if ($search = $request->input('search.value')) {
                        $query->where(function ($q) use ($search) {
                            $q->where('nombre', 'like', "%{$search}%")
                                ->orWhere('fecha_compra', 'like', "%{$search}%")
                                ->orWhere('sucursal', 'like', "%{$search}%")
                                ->orWhere('codigo', 'like', "%{$search}%")
                                ->orWhere('proveedor', 'like', "%{$search}%");
                        });
                    }
                })
                ->make(true);
        }
    }

    public function storeCompra(Request $request)
    {
        try {
            $empresa_id = Auth::user()->empresa_id;
            $codigoCompra = $this->genCodeCompra();
            DB::beginTransaction();
            $compra = Compra::create([
                'nombre' => $request->nombre,
                'fecha_compra' => $request->fecha_compra,
                'proveedor_id' => $request->proveedor_id,
                'empresa_id' => $empresa_id,
                'sucursal_id' => $request->sucursal_id,
                'estado' => 'Revisión',
                'codigo' => $codigoCompra,
                'tipo_comprobante' => $request->tipo_comprobante,
                'pedido_id' => $request->pedido_id,
                'user_id' => Auth::user()->id
            ]);

            if ($compra) {
                //Detalle de la compra
                $detalle_productos = json_decode($request->productos);

                foreach ($detalle_productos as $item) {
                    $total = $item->precio_unit * $item->cantidad;
                    DetalleCompra::create([
                        'compra_id' => $compra->id,
                        'producto_id' => $item->producto_id,
                        'costo_unitario' => $item->precio_unit,
                        'cantidad' => $item->cantidad,
                        'total' => $total,
                    ]);
                }
                //Cambiar estado del pedido
                Pedido::where('id', $request->pedido_id)->where('empresa_id', $empresa_id)->update([
                    'estado' => 'En revisión'
                ]);
                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'La compra se ha creado exitosamente.',
                    'compra' => $compra
                ]);
            }
            return response()->json([
                'status' => 'error',
                'message' => 'Hubo un problema al crear la compra.'
            ], 400);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function genCodeCompra()
    {
        $empresa_id = Auth::user()->empresa_id;
        $ultimaCompra = Compra::where('empresa_id', $empresa_id)->orderBy('id', 'desc')->first();

        if ($ultimaCompra) {
            $expl_codigo = explode('-', $ultimaCompra['codigo']);
            $correlativo = (int)$expl_codigo[1] + 1;
            $codigo = "OC-" . $correlativo;
        } else {
            $codigo = "OC-1";
        }
        return $codigo;
    }

    public function adddetallesdeCompra($id)
    {
        $oc = Compra::with('proveedores', 'sucursales', 'empresas', 'users')->find($id);
        $productos = Producto::all();
        return Inertia::render('Compras/DetailsCompra', compact('oc', 'productos'));
    }

    public function stroreDetalleCompra(Request $request)
    {
        $request->validate([
            'compra_id' => 'required|exists:compras,id',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos,id',
            'detalles.*.costo_unitario' => 'required|numeric|min:0',
            'detalles.*.cantidad' => 'required|numeric|min:1',
            'detalles.*.total' => 'required|numeric|min:0',
            'detalles.*.empresa_id' => 'required|exists:empresas,id',
            'detalles.*.sucursal_id' => 'required|exists:sucursals,id',
        ]);

        foreach ($request->detalles as $detalle) {
            DetalleCompra::create([
                'compra_id' => $request->compra_id,
                'producto_id' => $detalle['producto_id'],
                'costo_unitario' => $detalle['costo_unitario'],
                'cantidad' => $detalle['cantidad'],
                'total' => $detalle['total'],
            ]);
        }

        $compras = Compra::with(['detalles', 'proveedores', 'empresas', 'sucursales', 'users'])->findOrFail($request->compra_id);
        if ($compras) {
            $compras->estado = 'PAGADO';
            $compras->save();

            $pdf = Pdf::loadView('pdf.compra', compact('compras'));

            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf');

            return response()->json([
                'status' => 'success',
                'message' => 'Los detalles de la compra se han creado exitosamente.',
                'compras' => $compras
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Hubo un problema al guardar la compra.'
        ], 400);
    }


    public function viewDetailsCompras($id)
    {
        $compras = Compra::with(['detalles.productos', 'proveedores', 'empresas', 'sucursales', 'users'])->find($id);
        if (!$compras) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hubo un problema al intentar ver la compra.'
            ], 400);
        }

        return Inertia::render('Compras/ViewDetails', compact('compras'));
    }

    public function generarReportePdfDetalleCompras($id)
    {
        $decode_id = base64_decode($id);
        $compras = Compra::with(['detalles.productos', 'proveedores', 'empresas', 'sucursales', 'users'])->find($decode_id);

        if (!$compras) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hubo un problema al intentar ver la compra.'
            ], 400);
        }
        $pdf = PDF::loadView('pdf.comprasPdfDetalle', compact('compras'));
        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream('Compras_' . $compras->id . '.pdf');
    }

    public function generarReporteExcel($id)
    {
        $compra = Compra::with(['detalles.productos', 'proveedores', 'empresas', 'sucursales', 'users'])->find($id);

        if (!$compra) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hubo un problema al intentar ver la compra.'
            ], 400);
        }

        $fileName = 'Compra_' . $compra->id . '_detalles.xlsx';

        return Excel::download(new CompraDetallesExport($compra), $fileName);
    }



    public function deleteCompra($id)
    {
        $compras = Compra::find($id);
        if (!$compras) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hubo un problema al eliminar la compra.'
            ], 400);
        }

        if ($compras->proveedores || $compras->empresas || $compras->sucursales || $compras->users || $compras->detalles()->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No se puede eliminar la compra porque tiene registros asociados.'
            ], 400);
        }

        $compras->delete();
        if ($compras) {
            return response()->json([
                'status' => 'success',
                'message' => 'La compra se ha creado exitosamente.',
                'compras' => $compras
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Hubo un problema al eliminar la compra.'
        ], 400);
    }

    //Enviar compra a departamento de finanza
    public function sendCompraFinanza(Request $request)
    {
        $empresa_id = Auth::user()->empresa_id;
        $compra_id = $request->compra_id;

        $compra = Compra::where('id', $compra_id)->where('empresa_id', $empresa_id)->first();

        if ($compra) {
            $compra->estado = 'Pendiente';
            $compra->enviado_a_finanzas = 1;
            $compra->tiempo_transcurrido = Carbon::parse($compra->created_at)->diffForHumans();
            $compra->save();
            return response()->json([
                'status' => 'success',
                'message' => 'La compra se ha enviado para finanzas.'
            ]);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'No se ha encontrado la compra.'
        ]);
    }

    public function senPedidoBodega(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $compraId = $request->compra_id;

        $compra = Compra::where('id', $compraId)
            ->where('empresa_id', $empresaId)
            ->first();

        if (!$compra) {
            return response()->json([
                'status' => 'error',
                'message' => 'Compra no encontrada.',
            ], 404);
        }

        if (!$compra->pedido_id) {
            return response()->json([
                'status' => 'warning',
                'message' => 'Esta compra no está asociada a ningún pedido.',
            ]);
        }

        $pedido = Pedido::where('id', $compra->pedido_id)
            ->where('empresa_id', $empresaId)
            ->first();

        if (!$pedido) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pedido relacionado no encontrado.',
            ], 404);
        }

        $pedido->estado = 'APROBADO';
        $pedido->save();

        return response()->json([
            'status' => 'success',
            'message' => 'El estado del pedido ha sido actualizado a APROBADO.',
        ]);
    }


    //flujo para aprobar en finanzas
    public function viewComprasFinanzas(Request $request)
    {
        return Inertia::render('Compras/IndexFinanzas', [
            'proveedores' => Proveedor::select('id', 'nombre')->get(),
            'sucursales' => Sucursal::select('id', 'nombre')->get(),
            'compra_id' => $request->compra_id,
        ]);
    }


    //recibimos en finanzas 
    public function obtenerCompraporFinanzas(Request $request)
    {
        if ($request->ajax()) {
            Carbon::setLocale('es');

            $query = Compra::join('empresas as m', 'm.id', '=', 'compras.empresa_id')
                ->join('sucursals as s', 's.id', '=', 'compras.sucursal_id')
                ->join('users as u', 'u.id', '=', 'compras.user_id')
                ->join('proveedors as p', 'p.id', '=', 'compras.proveedor_id')
                ->select('compras.*', 'm.nombre as empresa', 's.nombre as sucursal', 'u.nombre as usuario', 'p.nombre as proveedor')
                ->where('compras.estado', 'PENDIENTE')
                ->where('compras.enviado_a_finanzas', true);

            if ($request->has('compra_id')) {
                $query->where('compras.id', $request->input('compra_id'));
            }

            $compras = $query->get();

            $compras->map(function ($compra) {
                $compra->tiempo_transcurrido = Carbon::parse($compra->created_at)->diffForHumans();
                return $compra;
            });

            return DataTables::of($compras)->toJson();
        }
    }

    // logica para aprobar la compra
    public function estadoCompraUpdate(Request $request)
    {

        $request->validate([
            'compra_id' => 'required|exists:compras,id',
            'estado' => 'required|string'
        ]);

        $empresa_id = Auth::user()->empresa_id;
        $compra = Compra::where('id', $request->compra_id)
            ->where('empresa_id', $empresa_id)
            ->first();

        if (!$compra) {
            return response()->json([
                'status' => 'error',
                'message' => 'No se ha encontrado la compra o no pertenece a tu empresa.'
            ]);
        }

        $compra->estado = $request->estado;
        $compra->enviado_a_finanzas = 0;
        $compra->save();

        return response()->json([
            'status' => 'success',
            'message' => 'El estado de la compra ha sido actualizado correctamente.'
        ]);
    }


    public function getCompraData(Request $request)
    {
        $empresa_id = Auth::user()->empresa_id;
        $compra_id = $request->get('compra_id');
        $existsCodigo = $request->get('codigo');
        $compra = null;
        if (!empty($existsCodigo)) {
            $compra = Compra::where('id', $compra_id)->where('empresa_id', $empresa_id)->first();
            if ($compra) {
                $detalleCompra = DB::select("select p.id as producto_id,dc.id,dc.cantidad,p.codigo,p.nombre,p.Umedida, dc.costo_unitario as precio_unit from detalle_compras as dc inner join productos as p on dc.producto_id=p.id where dc.compra_id = ? and p.empresa_id = ?;", [$compra['id'], $empresa_id]);

                $compra->fecha_compra = date('Y-m-d', strtotime($compra['fecha_compra']));
                $compra->detalle = $detalleCompra;

                return response()->json($compra);
            }
        } else {
            $pedido = Pedido::where('id', $compra_id)->where('empresa_id', $empresa_id)->first();
            if ($pedido) {
                $pedido->pedido_id = $pedido['id'];

                $detallePedido = DB::select("select p.id as producto_id,0 as id,dp.cantidad,p.codigo,p.nombre,p.Umedida, 0 as precio_unit from det_pedidos as dp inner join productos as p on dp.producto_id=p.id where dp.pedido_id = ? and p.empresa_id = ?;", [$compra_id, $empresa_id]);

                $pedido->fecha_compra = date('Y-m-d');
                $pedido->detalle = $detallePedido;

                return response()->json($pedido);
            }
        }
        return response()->json([]);
    }
    //Update compra
    public function updateCompra(Request $request)
    {
        try {

            $empresa_id = Auth::user()->empresa_id;

            $compra_id = $request->get('id');
            DB::beginTransaction();
            $compra = Compra::where('id', $compra_id)->where('empresa_id', $empresa_id)->update([
                'nombre' => $request->get('nombre'),
                'fecha_compra' => $request->get('fecha_compra'),
                'proveedor_id' => $request->get('proveedor_id'),
                'sucursal_id' => $request->get('sucursal_id'),
                //'pedido_id' => $request->get('pedido_id')
            ]);

            if ($compra) {
                //Detalle de la compra
                DetalleCompra::where('compra_id', $compra_id)->delete();
                $detalle_productos = json_decode($request->get('productos'));

                foreach ($detalle_productos as $item) {
                    $total = $item->precio_unit * $item->cantidad;
                    DetalleCompra::create([
                        'compra_id' => $compra_id,
                        'producto_id' => $item->producto_id,
                        'costo_unitario' => $item->precio_unit,
                        'cantidad' => $item->cantidad,
                        'total' => $total,
                    ]);
                }
                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'La compra se ha actualizado.',
                    'compra' => $compra
                ]);
            }
            return response()->json([
                'status' => 'error',
                'message' => 'Hubo un problema al actualizar la compra.'
            ], 400);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}
