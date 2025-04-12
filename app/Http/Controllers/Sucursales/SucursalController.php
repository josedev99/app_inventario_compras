<?php

namespace App\Http\Controllers\Sucursales;

use App\Http\Controllers\Controller;
use App\Models\Sucursales\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SucursalController extends Controller
{

            public function index()
        {
            $sucursales = Sucursal::all();
            return response()->json($sucursales);
        }

    public function store(Request $request)
    {
        // Validación
        $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:15',
            'correo' => 'nullable|email',
            'encargado' => 'required|string|max:255',
            'bodega' => 'nullable|string|max:255',
            'empresa_id' => 'required|exists:empresas,id', // Asegúrate de que `empresa_id` exista en la tabla `empresas`
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048', // Validación de imagen
        ]);

        // Creación de la sucursal
        $sucursal = new Sucursal();
        $sucursal->nombre = $request->nombre;
        $sucursal->direccion = $request->direccion;
        $sucursal->telefono = $request->telefono;
        $sucursal->correo = $request->correo;
        $sucursal->encargado = $request->encargado;
        $sucursal->bodega = $request->bodega;
        $sucursal->empresa_id = $request->empresa_id; // Asegúrate de que este campo esté en tu modelo Sucursal

        // Manejo del logo
        if ($request->hasFile('logo')) {
            // Guardar el logo en el directorio especificado
            $path = $request->file('logo')->store('assets/img/logosSucursales', 'public');
            // Guardar solo la ruta en la base de datos
            $sucursal->logo = $path;
        }

        // Guardar la sucursal
        $sucursal->save();

        return response()->json([
            'message' => 'Sucursal creada correctamente.',
            'sucursal' => $sucursal
        ], 201);
    }
}

