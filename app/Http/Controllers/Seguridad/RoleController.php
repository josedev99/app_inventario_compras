<?php

namespace App\Http\Controllers\Seguridad;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\Facades\DataTables;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Roles/Index');
    }

    public function getRoles(Request $request)
    {
        if ($request->ajax()) {
            $roles = Role::select('*')->orderBy('id', 'asc')->get();
            return DataTables::of($roles)
                ->addIndexColumn()
                ->make(true);
        }
        abort(403, 'Solo se permite acceso AJAX');
    }

    public function StoreRole(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ], [
            'name.required' => 'El nombre del rol es requerido.',
        ]);

        $role = Role::create([
            'name' => $request->name,
        ]);

        $role->save();

        return  response()->json([
            'status' => 'success',
            'message' => 'El role se ha creado exitosamente.',
            'role' => $role
        ]);
    }

    public function updateRoles(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['error' => 'No se pudo actualizar el rol']);
        }

        $role->update([
            'name' => $request->name,
        ]);

        return  response()->json([
            'status' => 'success',
            'message' => 'El role se ha actualizado exitosamente.',
            'role' => $role
        ]);
    }

    public function deleteRole($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['error' => 'No se puede encontrar el rol a eliminar'], 422);
        } elseif ($role->name == 'ROOT') {
            return response()->json(['error' => 'No puedes eliminar el rol ROOT'], 405);
        } elseif ($role->users()->exists()) {
            return response()->json(['error' => 'No puedes eliminar el rol ya que esta asigando a multiples usuarios.'], 405);
        }

        $role->delete();

        return  response()->json([
            'status' => 'success',
            'message' => 'El role se ha actualizado exitosamente.',
            'role' => $role
        ]);
    }
}
