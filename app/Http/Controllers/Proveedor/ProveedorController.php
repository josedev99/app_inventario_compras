<?php

namespace App\Http\Controllers\Proveedor;

use App\Http\Controllers\Controller;
use App\Models\Proveedores\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class ProveedorController extends Controller
{
    public function index()
    {
        return Inertia::render('Proveedores/Index');
    }

    public function getProveedores(Request $request)
    {
        if ($request->ajax()) {
            $proveedores = Proveedor::getProveedores();
            return DataTables::of($proveedores)
                ->addIndexColumn()
                ->make(true);
        }
        abort(403, 'Solo se permite acceso AJAX');
    }

    public function storeProveedor(Request $request)
    {
        $request->validate([
            'nombre' => 'required'
        ], [
            'nombre.required' => 'El nombre delproveedor es requerido'
        ]);

        $proveedor = Proveedor::create([
            'nombre' => $request->nombre,
        ]);

        $proveedor->save();

        return  response()->json([
            'status' => 'success',
            'message' => 'El proveedor se ha creado exitosamente.',
            'proveedor' => $proveedor
        ]);
    }

    public function updateProveedor(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required'
        ], [
            'nombre.required' => 'El nombre del proveedor es requerido.'
        ]);

        $proveedor = Proveedor::find($id);

        if (!$proveedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'No se encontró el proveedor que quieres actualizar.'
            ], 404);
        }

        $proveedor->nombre = $request->nombre;

        if ($proveedor->save()) {
            return response()->json([
                'status' => 'success',
                'message' => 'El proveedor se ha actualizado exitosamente.',
                'proveedor' => $proveedor
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Algo salió mal al actualizar el proveedor.'
        ], 500);
    }

    public function deleteProveedor($id)
    {
        $proveedor = Proveedor::find($id);

        if (!$proveedor) {
            return response()->json(['error' => 'Proveedor no encontrado.'], 404);
        }


        $proveedor->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'La categoría se ha eliminado exitosamente.',
            'proveedor' => $proveedor
        ]);
    }
}
