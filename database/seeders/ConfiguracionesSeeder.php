<?php

namespace Database\Seeders;

use App\Models\Empresa\Empresa;
use App\Models\Sucursales\Sucursal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ConfiguracionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        User::create([
            'nombre' => 'usuario default',
            'direccion' => 'ejemplo de direccion',
            'telefono' => '77665578',
            'email' => 'usuariodefault@gmail.com',
            'usuario' => 'user default',
            'password' => bcrypt(12345678),
            'passwordShow' => bcrypt(12345678),
            'profile' => 'ROOT',
            'status' => 'Active',
            'categoria' => 'Example',
            'empresa_id' => 1,
            'sucursal_id' => 1,
        ]);

        $root = Role::create(['name' => 'ROOT']);
        Role::create(['name' => 'FINANCIERO']);
        Role::create(['name' => 'PROVEEDURIA']);
        Role::create(['name' => 'BODEGA']);

        Permission::create(['name' => 'modulo_finanzas']);

        //categorias
        Permission::create(['name' => 'category_view']);
        Permission::create(['name' => 'category_create']);
        Permission::create(['name' => 'category_edit']);
        Permission::create(['name' => 'category_delete']);

        //proveedores
        Permission::create(['name' => 'proveedor_view']);
        Permission::create(['name' => 'proveedor_create']);
        Permission::create(['name' => 'proveedor_edit']);
        Permission::create(['name' => 'proveedor_delete']);

        //compras
        Permission::create(['name' => 'compras_view']);
        Permission::create(['name' => 'compras_create']);
        Permission::create(['name' => 'compras_detallesadd']);
        Permission::create(['name' => 'compras_viewdetails']);
        Permission::create(['name' => 'compras_delete']);

        //usuarios
        Permission::create(['name' => 'usuario_view']);
        Permission::create(['name' => 'usuario_create']);
        Permission::create(['name' => 'usuario_edit']);
        Permission::create(['name' => 'usuario_delete']);

        //roles
        Permission::create(['name' => 'role_view']);
        Permission::create(['name' => 'role_create']);
        Permission::create(['name' => 'role_edit']);
        Permission::create(['name' => 'role_delete']);

        //permisos
        Permission::create(['name' => 'permisos_view']);
        Permission::create(['name' => 'permisos_create']);
        Permission::create(['name' => 'permisos_edit']);
        Permission::create(['name' => 'permisos_delete']);

        Empresa::create([
            'nombre' => 'GRUPO GUERRERO',
            'nit' => '00009999',
            'nrc' => '0000000122',
            'giro' => 'otro',
            'direccion' => 'ejemplo',
            'telefono' => '77777777',
            'user_id' => 1
        ]);

        Sucursal::create([
            'nombre' => 'otra',
            'direccion' => 'Otra',
            'logo' => 'nologo.png',
            'encargado' => 'user default',
            'empresa_id' => 1,
            'telefono' => '7777777',
            'correo' => 'sucursal123@gmail.com',
            'bodega' => '1',
            'user_id' => 1
        ]);

        $root->givePermissionTo([
            'modulo_finanzas',
            'category_view',
            'category_create',
            'category_edit',
            'category_delete',
            'proveedor_view',
            'proveedor_create',
            'proveedor_edit',
            'proveedor_delete',
            'compras_view',
            'compras_create',
            'compras_detallesadd',
            'compras_viewdetails',
            'compras_delete',
            'usuario_view',
            'usuario_create',
            'usuario_edit',
            'usuario_delete',
            'role_view',
            'role_create',
            'role_edit',
            'role_delete',
            'permisos_view',
            'permisos_create',
            'permisos_edit',
            'permisos_delete',
        ]);



        $root = User::find(1);
        $root->syncRoles('ROOT');
    }
}
