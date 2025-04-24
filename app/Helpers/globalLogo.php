<?php

use App\Models\Compras\Compra;
use App\Models\Sucursales\Sucursal;

if (! function_exists('get_logo_sucursal')) {

    /**
     * Obtiene la ruta local del logo de la sucursal asociada a una compra.
     *
     * @param int $compraId
     * @return string|null
     */
    function get_logo_sucursal($compraId)
    {
        /* Obtenemos la compra por ID */
        $compra = Compra::with('sucursales')->find($compraId);

        /* Si la compra existe y tiene una sucursal asociada */
        if ($compra && $compra->sucursales) {
            /* Retornamos la ruta local del logo en storage */
            return public_path('storage/' . $compra->sucursales->logo);
        }

        /* Si no se encuentra el logo, retornar null */
        return null;
    }
}
