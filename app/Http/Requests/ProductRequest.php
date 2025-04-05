<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo' => 'required|string|max:50|unique:productos,codigo',
            'nombre' => 'required|string|max:255',
            'uMedida' => 'required|string|max:50',
            'costoUnit' => 'required|numeric|min:0|max:10000',
            'categoria_id' => 'required',
        ];
    }

    /**
     * Obtiene los mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'codigo.required' => 'El código es obligatorio.',
            'codigo.string' => 'El código debe ser una cadena de texto.',
            'codigo.max' => 'El código no debe superar los 50 caracteres.',
            'codigo.unique' => 'El código ya está en uso.',
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'nombre.string' => 'El nombre del producto debe ser una cadena de texto.',
            'nombre.max' => 'El nombre no debe superar los 255 caracteres.',
            'uMedida.required' => 'La unidad de medida es obligatoria.',
            'uMedida.string' => 'La unidad de medida debe ser una cadena de texto.',
            'uMedida.max' => 'La unidad de medida no debe superar los 50 caracteres.',
            'costoUnit.required' => 'El costo unitario es obligatorio.',
            'costoUnit.numeric' => 'El costo unitario debe ser un número.',
            'costoUnit.min' => 'El costo unitario no puede ser negativo.',
            'costoUnit.max' => 'El costo unitario no puede superar los 10,000.',
            'categoria_id.required' => 'La categoría es obligatoria.'
        ];
    }
}
