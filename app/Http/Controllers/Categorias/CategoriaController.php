<?php

namespace App\Http\Controllers\Categorias;

use App\Http\Controllers\Controller;
use App\Models\Categorias\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Psy\CodeCleaner\ReturnTypePass;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::orderBy('id', 'asc')->paginate(5);
        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias->items(),
            'paginacion' => $categorias
        ]);
    }

    public function storeCategoria(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'descripcion' => 'required'
        ], [
            'nombre.required' => 'El nombre dse la categoria es requerida',
            'descripcion.required' => 'La descripcion de la categoria es requerida',
        ]);

        $categoria = Categoria::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion
        ]);

        $categoria->save();

        return response()->json(['success' => 'La categoria se agrego correctamente']);
    }
}
