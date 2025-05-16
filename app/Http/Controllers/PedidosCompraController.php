<?php

namespace App\Http\Controllers;

use App\Models\Categorias\Categoria;
use App\Models\DetPedido;
use App\Models\Empresa\Empresa;
use App\Models\Pedido;
use App\Models\Productos\Producto;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use PDF;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class PedidosCompraController extends Controller
{
    public function index()
    {
        $empresaId = Auth::user()->empresa_id;
        //New linea
        $categorias = Categoria::select('id', 'nombre')->get();
        return Inertia::render('Pedido/Index', compact('categorias'));
    }

    public function save(Request $request)
    {
        try {
            DB::beginTransaction();
            $empresaId = Auth::user()->empresa_id;
            $sucursalId = Auth::user()->sucursal_id;
            $userId = Auth::user()->id;
            $codigo = $this->getCode('P');
            $productosPedido = json_decode($request->get('productos'));
            $pedido = Pedido::create([
                'codigo' => $codigo,
                'nombre' => $request['nombre'],
                'estado' => 'Pendiente',
                'empresa_id' => $empresaId,
                'sucursal_id' => $sucursalId,
                'user_id' => $userId
            ]);

            if ($pedido) {
                foreach ($productosPedido as $item) {
                    DetPedido::create([
                        'cantidad' => $item->cantidad,
                        'producto_id' => $item->id,
                        'pedido_id' => $pedido->id,
                        'empresa_id' => $empresaId
                    ]);
                }
                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'El pedido se ha creado con éxito.'
                ]);
            }
            return response()->json([
                'status' => 'error',
                'message' => 'Ha ocurrido un error al crear el pedido.'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Ha ocurrido un error inesperado.'
            ]);
        }
    }

    protected function getCode($prefijo = '')
    {
        $empresaId = Auth::user()->empresa_id;
        $pedido = Pedido::where('empresa_id', $empresaId)->select('codigo')->orderBy('id', 'desc')->first();
        $codigo = '';
        $year = substr(date('Y'), 2, 4);
        $month = date('m');
        if ($pedido) {
            $increment = (int)substr($pedido['codigo'], 6, 15) + 1;
            $codigo = $month . $year . $increment;
        } else {
            $codigo = $month . $year . "1";
        }
        $codigo = ($prefijo != '') ? $prefijo . "-" . $codigo : $codigo;
        return $codigo;
    }
    //Listar pedidos
    public function listarPedidos(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;

        $stocks = DB::table('pedidos as p')
            ->join('det_pedidos as dp', 'dp.pedido_id', '=', 'p.id')
            ->where('p.empresa_id', $empresaId)
            ->groupBy('p.id', 'p.codigo', 'p.nombre', 'p.created_at', 'p.estado')
            ->select(
                'p.id',
                'p.codigo',
                DB::raw('DATE_FORMAT(p.created_at,"%d/%m/%Y") as fecha'),
                'p.nombre',
                'p.estado',
                DB::raw('sum(dp.cantidad) as cantidad')
            )->orderBy('p.id', 'desc');

        return DataTables::of($stocks)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function ($q) use ($search) {
                        $q->where('p.codigo', 'like', "%{$search}%")
                            ->orWhere('p.nombre', 'like', "%{$search}%")
                            ->orWhere('p.created_at', 'like', "%{$search}%")
                            ->orWhere('p.estado', 'like', "%{$search}%");
                    });
                }
            })
            ->make(true);
    }

    public function getDetalle()
    {
        $empresaId = Auth::user()->empresa_id;
        $id = request()->get('id');

        $detalle_pedido = DB::select("select dp.id,dp.cantidad,p.codigo,p.nombre,p.Umedida from det_pedidos as dp inner join productos as p on dp.producto_id=p.id where dp.pedido_id = ? and dp.empresa_id = ?", [$id, $empresaId]);

        return response()->json($detalle_pedido);
    }

    //Generar documento pdf
    public function showPdf($param_id)
    {
        $userId = Auth::user()->id;
        $empresaId = Auth::user()->empresa_id;
        $pedido_id = base64_decode($param_id);

        $pedido = Pedido::where('id', $pedido_id)->where('empresa_id', $empresaId)->first();

        $sucursal = Sucursal::where('empresa_id', $empresaId)->select('nombre', 'logo')->first();
        $empresa = Empresa::where('id', $empresaId)->first();

        $user = User::where('id', $userId)->first();

        $detalle_pedido = DB::select("select dp.id,dp.cantidad,p.codigo,p.nombre,p.Umedida from det_pedidos as dp inner join productos as p on dp.producto_id=p.id where dp.pedido_id = ? and dp.empresa_id = ?", [$pedido_id, $empresaId]);

        $pdf = PDF::loadView('pdf.pedidoCompra', compact('detalle_pedido', 'pedido', 'sucursal', 'empresa', 'user'));
        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream(date('d-m-Y') . "_pedido_" . $pedido['codigo'] . ".pdf");
    }

    //Method implementado para obtener los productos de pedidos
    public function getProductosById($pedido_id = 0)
    {
        $empresaId = Auth::user()->empresa_id;
        $id = base64_decode($pedido_id);

        $detalle_pedido = DB::select("select p.id as producto_id,dp.id,dp.cantidad,p.codigo,p.nombre,p.Umedida, 0 as precio_unit from det_pedidos as dp inner join productos as p on dp.producto_id=p.id where dp.pedido_id = ? and dp.empresa_id = ?", [$id, $empresaId]);

        return response()->json($detalle_pedido);
    }
}
