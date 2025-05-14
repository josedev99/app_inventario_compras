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
            'email' => 'root@gmail.com',
            'usuario' => 'user default',
            'password' => bcrypt(12345678),
            'passwordShow' => bcrypt(12345678),
            'profile' => 'ROOT',
            'status' => 'Active',
            'categoria' => 'Example',
            'empresa_id' => 1,
            'sucursal_id' => 1,
        ]);

        User::create([
            'nombre' => 'financiero',
            'direccion' => 'ejemplo de direccion',
            'telefono' => '77665578',
            'email' => 'finaciero@gmail.com',
            'usuario' => 'finaciero',
            'password' => bcrypt(123456),
            'passwordShow' => bcrypt(123456),
            'profile' => 'FINANCIERO',
            'status' => 'Active',
            'categoria' => 'Example',
            'empresa_id' => 1,
            'sucursal_id' => 1,
        ]);

        User::create([
            'nombre' => 'proveeduria',
            'direccion' => 'ejemplo de direccion',
            'telefono' => '77665578',
            'email' => 'proveeduria@gmail.com',
            'usuario' => 'proveeduria',
            'password' => bcrypt(123456),
            'passwordShow' => bcrypt(123456),
            'profile' => 'PROVEEDURIA',
            'status' => 'Active',
            'categoria' => 'Example',
            'empresa_id' => 1,
            'sucursal_id' => 1,
        ]);


        User::create([
            'nombre' => 'bodega',
            'direccion' => 'ejemplo de direccion',
            'telefono' => '77665578',
            'email' => 'bodega@gmail.com',
            'usuario' => 'bodega',
            'password' => bcrypt(123456),
            'passwordShow' => bcrypt(123456),
            'profile' => 'BODEGA',
            'status' => 'Active',
            'categoria' => 'Example',
            'empresa_id' => 1,
            'sucursal_id' => 1,
        ]);

        $root = Role::create(['name' => 'ROOT']);
        $financiero = Role::create(['name' => 'FINANCIERO']);
        $proveedor = Role::create(['name' => 'PROVEEDURIA']);
        $bodega = Role::create(['name' => 'BODEGA']);

        //modulos
        Permission::create(['name' => 'modulo_finanzas']);
        Permission::create(['name' => 'modulo_proveeduria']);
        Permission::create(['name' => 'modulo_bodegas']);

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

        //asignar permisos
        Permission::create(['name' => 'asignar_view']);

        //empresas
        Permission::create(['name' => 'empresa_view']);
        Permission::create(['name' => 'empresa_create']);
        Permission::create(['name' => 'empresa_edit']);
        Permission::create(['name' => 'empresa_delete']);

        //sucursales
        Permission::create(['name' => 'sucursal_view']);
        Permission::create(['name' => 'sucursal_create']);

        //productos
        Permission::create(['name' => 'productos_view']);
        Permission::create(['name' => 'productos_create']);
        Permission::create(['name' => 'productos_edit']);
        Permission::create(['name' => 'productos_delete']);

        //inventarios
        Permission::create(['name' => 'inventarios_view']);
        Permission::create(['name' => 'inventarios_create']);
        Permission::create(['name' => 'inventarios_edit']);
        Permission::create(['name' => 'inventarios_delete']);
        Permission::create(['name' => 'inventarios_entrdas']);
        Permission::create(['name' => 'inventarios_salidas']);
        Permission::create(['name' => 'inventarios_movimentos']);

        //pedidos
        Permission::create(['name' => 'pedido_view']);
        Permission::create(['name' => 'nuevo_pedido']);
        Permission::create(['name' => 'pedido_pdf']);
        Permission::create(['name' => 'pedido_details']);

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
            'modulo_proveeduria',
            'modulo_bodegas',
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
            'asignar_view',
            'empresa_view',
            'empresa_create',
            'empresa_edit',
            'empresa_delete',
            'sucursal_view',
            'sucursal_create',
            'productos_view',
            'productos_create',
            'productos_edit',
            'productos_delete',
            'inventarios_view',
            'inventarios_create',
            'inventarios_entrdas',
            'inventarios_salidas',
            'inventarios_movimentos',
            'nuevo_pedido'
        ]);

        $financiero->givePermissionTo([
            'modulo_finanzas',
            'modulo_proveeduria',
            'modulo_bodegas',
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
            'asignar_view',
            'empresa_view',
            'empresa_create',
            'empresa_edit',
            'empresa_delete',
            'sucursal_view',
            'sucursal_create',
            'productos_view',
            'productos_create',
            'productos_edit',
            'productos_delete',
            'inventarios_view',
            'inventarios_create',
            'inventarios_entrdas',
            'inventarios_salidas',
            'inventarios_movimentos',
            'nuevo_pedido'
        ]);

        $proveedor->givePermissionTo([
            'category_view',
            'category_create',
            'category_edit',
            'category_delete',
            'proveedor_view',
            'proveedor_create',
            'proveedor_edit',
            'proveedor_delete',
            'productos_view',
            'productos_create',
            'productos_edit',
            'productos_delete',
            'nuevo_pedido'
        ]);

        $bodega->givePermissionTo([
            'inventarios_view',
            'inventarios_create',
            'inventarios_entrdas',
            'inventarios_salidas',
            'inventarios_movimentos',
            'nuevo_pedido'
        ]);




        $root = User::find(1);
        $root->syncRoles('ROOT');

        $financiero = User::find(2);
        $financiero->syncRoles('FINANCIERO');

        $proveedor = User::find(3);
        $proveedor->syncRoles('PROVEEDURIA');

        $bodega = User::find(4);
        $bodega->syncRoles('BODEGA');
    }
}
