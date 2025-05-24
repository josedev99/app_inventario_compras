<?php

namespace App\Http\Controllers\Categorias;

use App\Http\Controllers\Controller;
use App\Models\Categorias\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class CategoriaController extends Controller
{
    public function index()
    {
        return Inertia::render('Categorias/Index');
    }

    public function storeCategoria(Request $request)
    {
        $request->validate([
            'codigo' => 'required',
            'nombre' => 'required|unique:categorias,nombre',
            'descripcion' => 'required'
        ], [
            'codigo.required' => 'El código de la categoría es requerido',
            'nombre.required' => 'El nombre de la categoría es requerido',
            'nombre.unique' => 'El nombre de la categoría ya existe',
            'descripcion.required' => 'La descripción de la categoría es requerida',
        ]);

        $categoria = Categoria::create([
            'codigo' => trim(strtoupper($request->codigo)),
            'nombre' => trim($request->nombre),
            'descripcion' => $request->descripcion
        ]);

        $categoria->save();

        return  response()->json([
            'status' => 'success',
            'message' => 'la categoria se ha creado exitosamente.',
            'categoria' => $categoria
        ]);
    }

    public function getCategorias(Request $request)
    {
        if ($request->ajax()) {
            $categorias = Categoria::getCategories();
            return DataTables::of($categorias)
                ->addIndexColumn()
                ->make(true);
        }
        abort(403, 'Solo se permite acceso AJAX');
    }

    public function updateCategoria(Request $request, $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['error' => 'No se encontro la categoria que quieres actualizar'], 422);
        }

        $categoria->update([
            'codigo' => trim(strtoupper($request->codigo)),
            'nombre' => trim($request->nombre),
            'descripcion' => $request->descripcion
        ]);

        if ($categoria) {
            return   response()->json([
                'status' => 'success',
                'message' => 'la categoria se ha actualizo exitosamente.',
                'categoria' => $categoria
            ]);
        }
    }

    public function deleteCategoria($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['error' => 'Categoría no encontrada.'], 404);
        }

        if ($categoria->productos()->count() > 0) {
            return response()->json(['error' => 'No se puede eliminar esta categoría porque tiene productos asociados.'], 400);
        }


        $categoria->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'La categoría se ha eliminado exitosamente.',
            'categoria' => $categoria
        ]);
    }
}
