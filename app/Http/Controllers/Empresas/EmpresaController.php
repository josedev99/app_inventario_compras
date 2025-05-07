<?php

namespace App\Http\Controllers\Empresas;

use App\Http\Controllers\Controller;
use App\Models\Empresa\Empresa; // Importar el modelo de Empresa
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    public function index()
    {
        // Obtener todas las empresas con paginación (puedes ajustar la cantidad)
        $empresas = Empresa::orderBy('id', 'asc')->paginate(5);

        return Inertia::render('Empresas/Index', [
            'empresas' => $empresas->items(), // Los items para la vista
            'paginacion' => $empresas // Los datos de paginación (para usar en la vista si es necesario)
        ]);
    }

    public function store(Request $request)
    {
        // Validación de los datos del formulario
        $request->validate([
            'nombre' => 'required',
            'nit' => 'required',
            'nrc' => 'required',
            'giro' => 'required',
            'direccion' => 'required',
            'telefono' => 'required',
        ], [
            'nombre.required' => 'El nombre de la empresa es requerido.',
            'nit.required' => 'El NIT de la empresa es requerido.',
            'nrc.required' => 'El NRC de la empresa es requerido.',
            'giro.required' => 'El giro de la empresa es requerido.',
            'direccion.required' => 'La dirección de la empresa es requerida.',
            'telefono.required' => 'El teléfono de la empresa es requerido.',
        ]);

        // Crear la empresa en la base de datos
        $empresa = Empresa::create([
            'nombre' => $request->nombre,
            'nit' => $request->nit,
            'nrc' => $request->nrc,
            'giro' => $request->giro,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'user_id' => $request->user()->id, // Asumiendo que la empresa está relacionada con un usuario
        ]);

        // Guardar la empresa
        $empresa->save();

        // Retornar una respuesta exitosa
        return response()->json(['success' => 'La empresa se agregó correctamente']);
    }


        // Actualizar empresa
        public function update(Request $request, $id)
        {
            $empresa = Empresa::findOrFail($id);
        
            $request->validate([
                'nombre' => 'required',
                'nit' => 'required',
                'nrc' => 'required',
                'giro' => 'required',
                'direccion' => 'required',
                'telefono' => 'required',
            ]);
        
            $empresa->update($request->all());
        
            return response()->json(['success' => 'Empresa actualizada correctamente']);
        }
        
        public function destroy($id)
        {
            $empresa = Empresa::findOrFail($id);
            $empresa->delete();
        
            return response()->json(['success' => 'Empresa eliminada correctamente']);
        }
}
