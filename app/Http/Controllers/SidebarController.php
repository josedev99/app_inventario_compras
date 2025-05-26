<?php

namespace App\Http\Controllers;

use App\Models\Compras\Compra;
use Illuminate\Http\Request;

class SidebarController extends Controller
{
    public function counters(Request $request)
    {
        return response()->json([
            'comprasFinanzas' => Compra::where('estado', 'Pendiente')->count(),
            'counterPendingCompra' => Compra::where('estado', 'Pendiente')->count(),
        ]);
    }
}
