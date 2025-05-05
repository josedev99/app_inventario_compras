<?php

namespace App\Http\Controllers\Seguridad;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Yajra\DataTables\Facades\DataTables;

class PermisoController extends Controller
{
    public function index()
    {
        return Inertia::render('Permisos/Index');
    }

    public function getPermisos(Request $request)
    {
        if ($request->ajax()) {
            $permisos = Permission::select('*')->orderBy('id', 'asc')->get();
            return DataTables::of($permisos)
                ->addIndexColumn()
                ->make(true);
        }
        abort(403, 'Solo se permite acceso AJAX');
    }

    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ], [
            'name.required' => 'El nombre del permiso es requerido',
        ]);

        $permisos = Permission::create([
            'name' => $request->name,
        ]);

        if (!$permisos) {
            return response()->json(['error' => 'Algo salio mal al agregar el permiso por favor revisa de nuevo.'], 405);
        }

        $permisos->save();

        return  response()->json([
            'status' => 'success',
            'message' => 'El permiso se ha creado exitosamente.',
            'permisos' => $permisos
        ]);
    }

    public function updatePermiso(Request $request, $id)
    {
        $request->validate([
            'name' => 'required'
        ], [
            'name.required' => 'El nombre del permiso es requerido',
        ]);

        $permissions = Permission::find($id);

        if (!$permissions) {
            return response()->json(['error' => 'ups algo salio mal al intentar actualizar el permiso.'], 405);
        }

        $permissions->update([
            'name' => $request->name,
        ]);

        return  response()->json([
            'status' => 'success',
            'message' => 'El permiso se ha creado exitosamente.',
            'permissions' => $permissions
        ]);
    }

    public function deletePermiso($id)
    {
        $permissions = Permission::find($id);

        if (!$permissions) {
            return response()->json(['error' => 'No se puede eliminar el permiso, por que algo salio mal.'], 405);
        }

        $permissions->delete();

        return  response()->json([
            'status' => 'success',
            'message' => 'El permiso se ha creado exitosamente.',
            'permissions' => $permissions
        ]);
    }
}
