<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\Empresa\Empresa;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    public function index()
    {
        $dataEmpresas = Empresa::all();
        $dataSucursales = Sucursal::all();
        $roles = Role::all();
        return Inertia::render('Usuario/Index', compact('dataEmpresas', 'dataSucursales', 'roles'));
    }

    public function getUsersAll(Request $request)
    {
        $empresaId = Auth::user()->empresa_id;
        $users = DB::table('users as u')
            ->leftJoin('empresas as e', 'u.empresa_id', '=', 'e.id')
            ->leftJoin('sucursals as s', function ($join) {
                $join->on('u.sucursal_id', '=', 's.id')
                    ->on('e.id', '=', 's.empresa_id');
            })
            ->where('u.empresa_id', $empresaId)
            ->select(
                'u.id',
                'u.nombre',
                'u.direccion',
                'u.telefono',
                'u.usuario',
                'u.categoria',
                'u.profile',
                'u.status',
                'u.empresa_id',
                'u.sucursal_id',
                'u.email',
                'u.passwordShow',
                DB::raw("COALESCE(e.nombre, '-') as empresa"),
                DB::raw("COALESCE(s.nombre, '-') as sucursal")
            );

        return DataTables::of($users)
            ->addIndexColumn()
            ->filter(function ($query) use ($request) {
                if ($search = $request->input('search.value')) {
                    $query->where(function ($q) use ($search) {
                        $q->where('u.nombre', 'like', "%{$search}%")
                            ->orWhere('u.usuario', 'like', "%{$search}%")
                            ->orWhere('u.telefono', 'like', "%{$search}%")
                            ->orWhere('u.categoria', 'like', "%{$search}%")
                            ->orWhere('u.profile', 'like', "%{$search}%")
                            ->orWhere('u.status', 'like', "%{$search}%")
                            ->orWhere('e.nombre', 'like', "%{$search}%")
                            ->orWhere('s.nombre', 'like', "%{$search}%");
                    });
                }
            })
            ->make(true);
    }

    public function save(StoreUserRequest $data)
    {
        if ($data->input('profile') === 'ROOT') {
            return response()->json(['error' => 'Solo debe existir un usuario ROOT'], 405);
        }


        $user = User::create([
            'nombre'        => trim($data['nombre']),
            'direccion'     => trim($data['direccion']),
            'telefono'      => $data['telefono'],
            'email'         => $data['email'],
            'usuario'       => $data['usuario'],
            'password'      => Hash::make($data['password']),
            'passwordShow'  => encrypt($data['password']),
            'categoria'     => $data['categoria'],
            'empresa_id'    => $data['empresa_id'],
            'sucursal_id'   => $data['sucursal_id'],
            'profile'       => $data['profile'],
            'status'        => 'Active'
        ]);

        $user->syncRoles($data->input('profile'));

        return response()->json(['status' => 'success', 'message' => 'Usuario creado con éxito']);
    }

    public function update(StoreUserRequest $data, $id)
    {
        $user = User::findOrFail($id);

        /* Validar que no se actualice a ROOT si ya existe otro ROOT */
        if ($data->input('profile') === 'ROOT' && User::where('profile', 'ROOT')->where('id', '!=', $id)->exists()) {
            return response()->json(['error' => 'Solo debe existir un usuario ROOT'], 405);
        }

        $user->update([
            'nombre'        => trim($data['nombre']),
            'direccion'     => trim($data['direccion']),
            'telefono'      => $data['telefono'],
            'email'         => $data['email'],
            'usuario'       => $data['usuario'],
            'categoria'     => $data['categoria'],
            'empresa_id'    => $data['empresa_id'],
            'sucursal_id'   => $data['sucursal_id'],
            'profile'       => $data['profile'],
            'status'        => $data['status'],
        ]);

        /* Solo actualizar la contraseña si se envía */
        if ($data->filled('password')) {
            $user->update([
                'password'      => Hash::make($data['password']),
                'passwordShow'  => encrypt($data['password']),
            ]);
        }

        $user->syncRoles($data->input('profile'));

        return response()->json(['status' => 'success', 'message' => 'Usuario actualizado con éxito']);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'No se puede eliminar el usuario del sistema.'], 405);
        } elseif ($user->profile == 'ROOT') {
            return response()->json(['error' => 'No se puede eliminar el usuario root'], 405);
        } elseif (Auth::id() == $user->id) {
            return response()->json(['error' => 'No puedes eliminar el usuario autenticado'], 405);
        }

        $user->delete();

        if ($user) {
            return response()->json(['status' => 'success', 'message' => 'Usuario actualizado con éxito']);
        }
    }
}
