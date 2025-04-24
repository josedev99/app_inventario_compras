<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
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
}
