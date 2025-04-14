<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() ? true : false;
    }

    public function rules(): array
    {
        return [
            'usuario' => [
                'required',
                'string',
                'max:50',
                Rule::unique('users', 'usuario')->ignore($this->usuario) // <- Aquí ignora el actual
            ],
            'nombre'       => 'required|string|max:255',
            'direccion'    => 'required|string|max:255',
            'telefono'     => 'required|string|max:20',
            'email'        => 'required|email',
            'password'     => 'required|string|min:6',
            'categoria'    => 'required|string|max:100',
            'empresa_id'   => 'required|exists:empresas,id',
            'sucursal_id'  => 'required|exists:sucursals,id',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required'        => 'El nombre es obligatorio.',
            'nombre.string'          => 'El nombre debe ser un texto.',
            'nombre.max'             => 'El nombre no puede tener más de 255 caracteres.',

            'direccion.required'     => 'La dirección es obligatoria.',
            'direccion.string'       => 'La dirección debe ser un texto.',
            'direccion.max'          => 'La dirección no puede tener más de 255 caracteres.',

            'telefono.required'      => 'El teléfono es obligatorio.',
            'telefono.string'        => 'El teléfono debe ser un texto.',
            'telefono.max'           => 'El teléfono no puede tener más de 20 caracteres.',

            'email.required'         => 'El correo electrónico es obligatorio.',
            'email.email'            => 'El correo electrónico no es válido.',

            'usuario.required'       => 'El nombre de usuario es obligatorio.',
            'usuario.string'         => 'El nombre de usuario debe ser un texto.',
            'usuario.max'            => 'El nombre de usuario no puede tener más de 50 caracteres.',
            'usuario.unique'         => 'El nombre de usuario ya está en uso.',

            'password.required'      => 'La contraseña es obligatoria.',
            'password.string'        => 'La contraseña debe ser un texto.',
            'password.min'           => 'La contraseña debe tener al menos 6 caracteres.',

            'categoria.required'     => 'La categoría es obligatoria.',
            'categoria.string'       => 'La categoría debe ser un texto.',
            'categoria.max'          => 'La categoría no puede tener más de 100 caracteres.',

            'empresa_id.required'    => 'La empresa es obligatoria.',
            'empresa_id.exists'      => 'La empresa seleccionada no es válida.',

            'sucursal_id.required'   => 'La sucursal es obligatoria.',
            'sucursal_id.exists'     => 'La sucursal seleccionada no es válida.',
        ];
    }
}
