<?php

use App\Http\Controllers\Categorias\CategoriaController;
use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Empresas\EmpresaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\inventario\InventarioController;
use App\Http\Controllers\PedidosCompraController;
use App\Http\Controllers\Producto\ProductoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Sucursales\SucursalController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\Proveedor\ProveedorController;
use App\Http\Controllers\Seguridad\AsignarController;
use App\Http\Controllers\Seguridad\PermisoController;
use App\Http\Controllers\Seguridad\RoleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use PHPUnit\Framework\MockObject\Rule\AnyParameters;

// Ruta principal (Home)
Route::get('/', [HomeController::class, 'index'])
    ->middleware(['auth', 'estado', 'permission:modulo_finanzas'])
    ->name('home.index');

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'estado', 'permission:modulo_finanzas'])->name('dashboard');



// Rutas que requieren autenticación
Route::middleware(['auth', 'estado'])->group(function () {
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Categorías
    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    Route::post('/storeCategoria', [CategoriaController::class, 'storeCategoria'])->name('categoria.storeCategoria');
    Route::get('/obtener-categorias', [CategoriaController::class, 'getCategorias'])->name('categorias.all');
    Route::post('/update/categoria/{id}', [CategoriaController::class, 'updateCategoria'])->name('categorias.updateCategoria');
    Route::delete('/delete/categoria/{id}', [CategoriaController::class, 'deleteCategoria'])->name('categoria.delete');


    /**Parte para proveedores */
    Route::get('/proveedores', [ProveedorController::class, 'index'])->name('proveedores.index');
    Route::get('/obtener-proveedores', [ProveedorController::class, 'getProveedores'])->name('proveedores.all');
    Route::post('/store/proveedor', [ProveedorController::class, 'storeProveedor'])->name('proveedor.store');
    Route::post('/update/proveedor/{id}', [ProveedorController::class, 'updateProveedor'])->name('proveedor.updateProveedor');
    Route::delete('/proveedor/delete/{id}', [ProveedorController::class, 'deleteProveedor'])->name('proveedor.deleteProveedor');

    /**
     * parte para compras
     */
    Route::get('/compras', [ComprasController::class, 'index'])->name('compras.index');
    Route::get('/obtener/compras/data', [ComprasController::class, 'getDataCompras'])->name('compras.getDataCompras');
    Route::post('/store/compra', [ComprasController::class, 'storeCompra'])->name('compras.storeCompra');
    Route::delete('/delete/compra/{id}', [ComprasController::class, 'deleteCompra'])->name('compras.deleteCompra');
    Route::get('/agregar/detalles/compras/{id}', [ComprasController::class, 'adddetallesdeCompra'])->name('compras.adddetallesdeCompra');
    Route::post('/store/detalle/compra', [ComprasController::class, 'stroreDetalleCompra'])->name('compras.stroreDetalleCompra');
    Route::get('/view/detalles/compras/{id}', [ComprasController::class, 'viewDetailsCompras'])->name('compras.viewDetailsCompras');
    Route::get('/generar/pdf/detalle/compras/{id}', [ComprasController::class, 'generarReportePdfDetalleCompras'])->name('compras.generarReportePdfDetalleCompras');
    Route::get('/generar/excel/compras/detalles/{id}', [ComprasController::class, 'generarReporteExcel'])->name('compras.generarReporteExcel');

    //Routas para obtener los productos de pedidos
    Route::get('/compra/obtener/productos/pedidos/{pedido_id}', [PedidosCompraController::class, 'getProductosById'])->name('pedido.obtener.productos.id');
    //Aprobar compra
    Route::post('/compra/enviar/finanza', [ComprasController::class, 'sendCompraFinanza'])->name('compras.enviar.finanza');
    //Obtener datos de la compra
    Route::post('/compra/obtener/data', [ComprasController::class, 'getCompraData'])->name('compras.data.obtener');
    //Update compra
    Route::post('/compra/actualizar', [ComprasController::class, 'updateCompra'])->name('compras.update');

    //flujo para finanzas
    Route::get('/obetener/orden/por/estado', [ComprasController::class, 'viewComprasFinanzas'])->name('compras.estado');
    Route::get('/obetener/orden/por/estado/get/data/finanzas', [ComprasController::class, 'obtenerCompraporFinanzas'])->name('compras.obtenerCompraporFinanzas');
    Route::post('/update/estado/compra', [ComprasController::class, 'estadoCompraUpdate'])->name('compras.estadoCompraUpdate');
    Route::post('/notificacion/pedido/bodega', [ComprasController::class, 'senPedidoBodega'])->name('compras.senPedidoBodega');

    /** Parte para empresas */
    Route::get('/empresas', [EmpresaController::class, 'index'])->name('empresas.index');
    Route::post('/storeEmpresa', [EmpresaController::class, 'store'])->name('empresa.store');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update'])->name('empresa.update');
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy'])->name('empresa.destroy');

    /**
     * parte para sucursales
     */
    Route::get('/sucursales', [SucursalController::class, 'index']);
    Route::post('/sucursales', [SucursalController::class, 'store'])->name('sucursal.store');
    Route::get('/sucursales/create', [SucursalController::class, 'create'])->name('sucursal.create');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy']);


    /**Parte para roles */
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/get/data', [RoleController::class, 'getRoles'])->name('roles.getRoles');
    Route::post('/store/role', [RoleController::class, 'StoreRole'])->name('roles.add');
    Route::post('/update/role/{id}', [RoleController::class, 'updateRoles'])->name('roles.update');
    Route::delete('/delete/role/{id}', [RoleController::class, 'deleteRole'])->name('roles.deleteRole');

    /**Parte para permisos */
    Route::get('/permisos', [PermisoController::class, 'index'])->name('permisos.index');
    Route::get('/permisos/index/data', [PermisoController::class, 'getPermisos'])->name('permisos.getPermisos');
    Route::post('/store/permisos', [PermisoController::class, 'storePermission'])->name('permisos.storePermission');
    Route::post('/update/permiso/{id}', [PermisoController::class, 'updatePermiso'])->name('permisos.updatePermiso');
    Route::delete('/delete/permiso/{id}', [PermisoController::class, 'deletePermiso'])->name('permisos.deletePermiso');

    /**asignacion de permisos y roles */
    Route::get('/asignar', [AsignarController::class, 'index'])->name('asignar.index');
    Route::get('/asignar/getData', [AsignarController::class, 'getDataIndexAsignar'])->name('asignar.getDataIndexAsignar');
    Route::post('/store/asignar', [AsignarController::class, 'storeAsignarPermisosRoles'])->name('asignar.storeAsignarPermisosRoles');
    Route::post('/asiganr/todo', [AsignarController::class, 'AsignarTodo'])->name('asignar.AsignarTodo');
    Route::post('/revocar/todo', [AsignarController::class, 'RevocarTodo'])->name('asignar.RevocarTodo');
});

/**
 * Rutas para el módulo de productos
 */
Route::prefix('producto')->middleware(['auth', 'estado'])->group(function () {
    Route::get('/', [ProductoController::class, 'index'])->name('producto.index');
    Route::post('/save', [ProductoController::class, 'save'])->name('producto.save');
    Route::get('/obtener-productos', [ProductoController::class, 'getProducosAll'])->name('producto.all');
    Route::post('/actualizar-producto', [ProductoController::class, 'update'])->name('producto.update');
    Route::post('/eliminar', [ProductoController::class, 'destroy'])->name('producto.destroy');
});
/**
 * Rutas para el módulo de inventario
 */
Route::prefix('pedidos')->middleware(['auth', 'estado'])->group(function () {
    Route::get('/', [PedidosCompraController::class, 'index'])->name('pedido.index');
    Route::post('/guardar', [PedidosCompraController::class, 'save'])->name('pedido.save');
    Route::get('/listar', [PedidosCompraController::class, 'listarPedidos'])->name('pedido.listar');
    //Obtener los detalles del pedido
    Route::post('/detalles', [PedidosCompraController::class, 'getDetalle'])->name('pedido.obtener');
    //Obtener productos de pedidos
    Route::get('obtener-productos', [ProductoController::class,'getProductsPedidos'])->name('pedidos.productos.obtener');
    //show pdf pedido
    Route::get('/documento/pdf/{id}', [PedidosCompraController::class, 'showPdf'])->name('pedido.show.pdf');
    //Editing pedidos
    Route::post('obtener/data', [PedidosCompraController::class, 'getPedidoById'])->name('pedido.edit');
    Route::post('update', [PedidosCompraController::class, 'updatePedido'])->name('pedido.update');
    //Ruta para enviar a proveeduria
    Route::post('enviar/depto/proveeduria', [PedidosCompraController::class, 'enviarPedido'])->name('pedido.send.proved');
});
/**
 * Rutas para el módulo de inventario
 */
Route::prefix('inventario')->middleware(['auth', 'estado'])->group(function () {
    Route::get('/', [InventarioController::class, 'index'])->name('inventario.index');
    Route::get('/listar', [InventarioController::class, 'getStockInv'])->name('inventario.listar');
    Route::post('/listar-productos-compra', [InventarioController::class, 'getProductCompra'])->name('producto.search.compra');
    //Ingresos a inventario
    Route::get('/ingresos', [InventarioController::class, 'indexIngreso'])->name('inv.ingreso.index');
    Route::post('/registrar-ingreso', [InventarioController::class, 'saveIngreso'])->name('inventario.saveIngreso');
    //Listar ingresos
    Route::get('/listar-ingresos', [InventarioController::class, 'getEntradaMov'])->name('inventario.listar.entradas');
    Route::post('/detalle-ingresos', [InventarioController::class, 'getDetalleMov'])->name('inv.det.ingreso');
    //show pdf pedido
    Route::get('/documento/pdf/ingresos/{id}', [InventarioController::class, 'genPdfMovIngreso'])->name('inv.det.ingreso.pdf');


    Route::get('/index/salidas', [InventarioController::class, 'indexMovSalidas'])->name('inv.salidasindex');
    Route::get('/get/index/data/salidas', [InventarioController::class, 'getSalidaMov'])->name('inv.getSalidaMov');
    Route::post('/registrar/salida/inv', [InventarioController::class, 'saveSalida'])->name('inv.saveSalida');
    Route::get('/documento/pdf/salidas/{id}', [InventarioController::class, 'genPdfMovSalida'])->name('inv.salida.pdf');
});
/**
 * Routas para usuarios
 */
Route::prefix('usuarios')->middleware(['auth', 'estado'])->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('user.index');
    Route::get('/obtener-usuarios', [UserController::class, 'getUsersAll'])->name('usuario.all');
    Route::post('/guardar', [UserController::class, 'save'])->name('user.save');
    Route::post('/update/user/{id}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/user/delete/{id}', [UserController::class, 'deleteUser'])->name('user.delete');
});

Route::get('/notaccess', function () {
    return Inertia::render('Auth/Access');
});


require __DIR__ . '/auth.php';
