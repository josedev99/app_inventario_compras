<?php

namespace App\Http\Controllers\Seguridad;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\Facades\DataTables;

class AsignarController extends Controller
{
    public function index()
    {
        return Inertia::render('Asignar/Index', [
            'roles' => Role::select('id', 'name')->get(),
            'permisos' => Permission::select('id', 'name')->get()
        ]);
    }

    public function getDataIndexAsignar(Request $request)
    {
        if ($request->ajax()) {
            $roleId = $request->role_id;

            if (!$roleId || $roleId === 'Elegir') {
                return response()->json(['error' => 'No se seleccionó un rol válido.'], 422);
            }

            $permissions = Permission::orderBy('id', 'asc')->get();
            $role = Role::find($roleId);

            /* Verificar si el rol existe */
            if (!$role) {
                return response()->json(['error' => 'Rol no encontrado.'], 404);
            }

            /* Creamos la respuesta con el estado 'assigned' de los permisos */
            $permissionsWithAssigned = $permissions->map(function ($permiso) use ($role) {
                return [
                    'id' => $permiso->id,
                    'name' => $permiso->name,
                    'assigned' => $role->hasPermissionTo($permiso->name) /* Estado asignado del permiso */
                ];
            });

            return DataTables::of($permissionsWithAssigned)
                ->addIndexColumn()
                ->addColumn('name', function ($permiso) {
                    return $permiso['name'];
                })
                ->addColumn('acciones', function ($permiso) {
                    /* Ahora estamos usando el valor 'assigned' que enviamos desde el backend */
                    $isChecked = $permiso['assigned'] ? 'checked' : '';
                    return '<div class="text-center">
                                <input type="checkbox" class="form-check-input" data-id="' . $permiso['id'] . '" ' . $isChecked . '>
                            </div>';
                })
                ->rawColumns(['acciones'])
                ->make(true);
        }

        abort(403, 'Solo se permite acceso AJAX');
    }


    public function storeAsignarPermisosRoles(Request $request)
    {
        $request->merge([
            'assign' => filter_var($request->assign, FILTER_VALIDATE_BOOLEAN),
        ]);

        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
            'assign' => 'required|boolean',
        ]);

        $role = Role::find($request->role_id);
        $permission = Permission::find($request->permission_id);

        if (!$role || !$permission) {
            return response()->json(['error' => 'Datos inválidos.'], 422);
        }

        if ($request->assign) {
            $role->givePermissionTo($permission);
            return response()->json([
                'success' => "Permiso '{$permission->name}' asignado correctamente al rol '{$role->name}'."
            ], 200);
        } else {
            $role->revokePermissionTo($permission);
            return response()->json([
                'success' => "Permiso '{$permission->name}' revocado del rol '{$role->name}'."
            ], 200);
        }
    }

    public function AsignarTodo(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::find($request->role_id);

        if (!$role) {
            return response()->json(['error' => 'Rol no encontrado'], 405);
        }

        $permisos = Permission::all();

        $role->givePermissionTo($permisos);

        return $role;

        return response()->json(['success' => "Todos los permisos fueron asignados al rol '{$role->name}'."], 200);
    }

    public function RevocarTodo(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);
        $role = Role::find($request->role_id);

        if (!$role) {
            return response()->json(['error' => 'Rol no encontrado'], 405);
        }

        $permissions = Permission::select('*')->get();

        $role->revokePermissionTo($permissions);

        return response()->json(['success' => "Todos los permisos fueron revocados del rol '{$role->name}'."], 200);
    }
}
