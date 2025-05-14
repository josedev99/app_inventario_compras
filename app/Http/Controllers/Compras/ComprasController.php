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
            'pedidos' => Pedido::select('id', 'nombre', DB::raw('DATE_FORMAT(created_at,"%d/%m/%Y") as fecha'))->where('estado','Pendiente')->get(),
            'sucursales' => Sucursal::select('id', 'nombre')->get(),
        ]);
    }


    public function getDataCompras(Request $request)
    {

        if ($request->ajax()) {
            $compras = Compra::getData();
            return DataTables::of($compras)->toJson();
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
                'estado' => 'Pendiente',
                'codigo' => $codigoCompra,
                'user_id' => Auth::user()->id
            ]);

            //Detalle de la compra
            $detalle_productos = json_decode($request->productos);

            foreach($detalle_productos as $item){
                $total = $item->precio_unit * $item->cantidad;
                DetalleCompra::create([
                    'compra_id' => $compra->id,
                    'producto_id' => $item->producto_id,
                    'costo_unitario' => $item->precio_unit,
                    'cantidad' => $item->cantidad,
                    'total' => $total,
                ]);
            }
            DB::commit();
            if ($compra) {
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

    public function genCodeCompra(){
        $empresa_id = Auth::user()->empresa_id;
        $ultimaCompra = Compra::where('empresa_id', $empresa_id)->orderBy('id','desc')->first();

        if($ultimaCompra){
            $expl_codigo = explode('-', $ultimaCompra['codigo']);
            $correlativo = (int)$expl_codigo[1] + 1;
            $codigo = "OC-" . $correlativo;
        }else{
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
}
