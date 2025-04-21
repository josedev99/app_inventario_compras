<?php

namespace App\Http\Controllers\Sucursales;

use App\Http\Controllers\Controller;
use App\Models\Sucursales\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SucursalController extends Controller
{
    public function index()
    {
        $sucursales = Sucursal::all();
        return response()->json($sucursales);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:15',
            'correo' => 'nullable|email',
            'encargado' => 'required|string|max:255',
            'bodega' => 'nullable|string|max:255',
            'empresa_id' => 'required|exists:empresas,id',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $sucursal = new Sucursal();
        $sucursal->nombre = $request->nombre;
        $sucursal->direccion = $request->direccion;
        $sucursal->telefono = $request->telefono;
        $sucursal->correo = $request->correo;
        $sucursal->encargado = $request->encargado;
        $sucursal->bodega = $request->bodega;
        $sucursal->empresa_id = $request->empresa_id;

        // Guardar el ID del usuario logueado
        $sucursal->user_id = Auth::id(); // <-- Aquí se guarda automáticamente

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = $file->getClientOriginalName();
            $file->move(public_path('assets/img/logosSucursales'), $filename);
            $sucursal->logo = 'assets/img/logosSucursales/' . $filename;
        }

        $sucursal->save();

        return response()->json([
            'message' => 'Sucursal creada correctamente.',
            'sucursal' => $sucursal
        ], 201);
    }
}
