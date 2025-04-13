<?php

use App\Http\Controllers\Categorias\CategoriaController;
use App\Http\Controllers\Empresas\EmpresaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Producto\ProductoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Sucursales\SucursalController; 
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta principal (Home)
Route::get('/', [HomeController::class, 'index'])
    ->middleware('auth')
    ->name('home.index');

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas que requieren autenticación
Route::middleware('auth')->group(function () {
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Categorías
    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    Route::post('/storeCategoria', [CategoriaController::class, 'storeCategoria'])->name('categoria.storeCategoria');
    Route::get('/obtener-categorias', [CategoriaController::class, 'getCategorias'])->name('categorias.all');
    Route::delete('/delete/categoria/{id}', [CategoriaController::class, 'deleteCategoria'])->name('categoria.delete');

    // Empresas
    Route::get('/empresas', [EmpresaController::class, 'index'])->name('empresas.index');
    Route::post('/storeEmpresa', [EmpresaController::class, 'store'])->name('empresa.store');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update'])->name('empresa.update');
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy'])->name('empresa.destroy');
    // Sucursales: Esta ruta se usará para la creación de sucursales desde el modal
    Route::get('/sucursales', [SucursalController::class, 'index']);
    Route::post('/sucursales', [SucursalController::class, 'store'])->name('sucursal.store');
    Route::get('/sucursales/create', [SucursalController::class, 'create'])->name('sucursal.create');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy']);
});

/**
 * Rutas para el módulo de productos
 */
Route::prefix('producto')->middleware('auth')->group(function () {
    Route::get('/', [ProductoController::class, 'index'])->name('producto.index');
    Route::post('/save', [ProductoController::class, 'save'])->name('producto.save');
    Route::get('/obtener-productos', [ProductoController::class, 'getProductos'])->name('producto.all');
});
/**
 * Routas para usuarios
*/
Route::prefix('usuarios')->middleware('auth')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('user.index');
    Route::get('/obtener-usuarios', [UserController::class, 'getUsersAll'])->name('usuario.all');
});
require __DIR__.'/auth.php';
