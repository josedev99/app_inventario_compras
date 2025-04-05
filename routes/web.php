<?php

use App\Http\Controllers\Categorias\CategoriaController;
use App\Http\Controllers\Empresas\EmpresaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Producto\ProductoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});**/
Route::get('/', [HomeController::class, 'index'])->middleware('auth')->name('home.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /**parte para categorias */
    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    Route::post('/storeCategoria', [CategoriaController::class, 'storeCategoria'])->name('categoria.storeCategoria');

    /** Parte para empresas */
    Route::get('/empresas', [EmpresaController::class, 'index'])->name('empresas.index');
    Route::post('/storeEmpresa', [EmpresaController::class, 'store'])->name('empresa.store');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update'])->name('empresa.update');
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy'])->name('empresa.destroy');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy']);
    
});




/**
 * Routas para module productos
 */
Route::prefix('producto')->middleware('auth')->group(function () {
    Route::get('/', [ProductoController::class, 'index'])->name('producto.index');
    Route::post('/save', [ProductoController::class, 'save'])->name('producto.save');
    Route::get('/obtener-productos', [ProductoController::class, 'getProductos'])->name('producto.all');
});


require __DIR__.'/auth.php';
