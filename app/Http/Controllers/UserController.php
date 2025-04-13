<?php

namespace App\Http\Controllers;

use App\Models\Empresa\Empresa;
use App\Models\Sucursales\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    public function index(){
        $empresas = Empresa::all();
        $sucursales = Sucursal::all();
        return Inertia::render('Usuario/Index', compact('empresas', 'sucursales'));
    }

    public function getUsersAll(Request $request){
        $users = DB::table('users as u')
        ->leftJoin('empresas as e', 'u.empresa_id', '=', 'e.id')
        ->leftJoin('sucursals as s', function($join) {
            $join->on('u.sucursal_id', '=', 's.id')
                 ->on('e.id', '=', 's.empresa_id');
        })
        ->select(
            'u.id',
            'u.nombre',
            'u.telefono',
            'u.usuario',
            'u.categoria',
            DB::raw("COALESCE(e.nombre, '-') as empresa"),
            DB::raw("COALESCE(s.nombre, '-') as sucursal")
        );

        return DataTables::of($users)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function($q) use ($search) {
                        $q->where('u.nombre', 'like', "%{$search}%")
                        ->orWhere('u.usuario', 'like', "%{$search}%")
                        ->orWhere('u.telefono', 'like', "%{$search}%")
                        ->orWhere('u.categoria', 'like', "%{$search}%")
                        ->orWhere('e.nombre', 'like', "%{$search}%")
                        ->orWhere('s.nombre', 'like', "%{$search}%");
                    });
                }
            })
            ->make(true);
    }
}
