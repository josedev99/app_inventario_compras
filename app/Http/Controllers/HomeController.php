<?php

namespace App\Http\Controllers;

use App\Models\Categorias\Categoria;
use App\Models\Compras\Compra;
use App\Models\Inventarios\Inventario;
use App\Models\Proveedores\Proveedor;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categoriasCount = Categoria::count();
        $usuariosCount = User::count();
        $proveedoresCount = Proveedor::count();
        $comprasCount = Compra::count();

        $comprasporMes = Compra::selectRaw('MONTH(fecha_compra) as mes, COUNT(*) as total')
            ->groupBy('mes')
            ->orderBy('mes')
            ->pluck('total', 'mes')
            ->toArray();

        $meses = [
            1 => 'Enero',
            2 => 'Febrero',
            3 => 'Marzo',
            4 => 'Abril',
            5 => 'Mayo',
            6 => 'Junio',
            7 => 'Julio',
            8 => 'Agosto',
            9 => 'Septiembre',
            10 => 'Octubre',
            11 => 'Noviembre',
            12 => 'Diciembre'
        ];

        $labels = array_values($meses);
        $dataCompras = array_map(fn($mes) => $comprasporMes[$mes] ?? 0, array_keys($meses));

        $productosVendidos = DB::table('detalle_compras as dc')
            ->join('productos as p', 'dc.producto_id', '=', 'p.id')
            ->select('p.nombre', DB::raw('SUM(dc.cantidad) as total_vendido'))
            ->groupBy('p.nombre')
            ->orderByDesc('total_vendido')
            ->limit(5)
            ->get();

        $productosLabels = $productosVendidos->pluck('nombre');
        $productosData = $productosVendidos->pluck('total_vendido');

        $inventario = DB::table('inventarios as inv')
            ->join('productos as p', 'inv.producto_id', '=', 'p.id')
            ->select('p.nombre', 'inv.cantidad')
            ->orderByDesc('inv.cantidad')
            ->take(5)
            ->get();

        return Inertia::render('Home/Home', [
            'categoriasCount' => $categoriasCount,
            'usuariosCount' => $usuariosCount,
            'proveedoresCount' => $proveedoresCount,
            'comprasCount' => $comprasCount,
            'labels' => $labels,
            'dataCompras' => $dataCompras,
            'productosLabels' => $productosLabels,
            'productosData' => $productosData,
            'inventario' => $inventario,
            'auth' => [
                'user' => auth()->user()->only(['id', 'nombre', 'email']),
                'permissions' => auth()->user()->getAllPermissions()->pluck('name')->toArray(),
            ],
        ]);
    }
}
