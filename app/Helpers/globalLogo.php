<?php

use App\Models\Compras\Compra;
use App\Models\Sucursales\Sucursal;
use Illuminate\Support\Facades\Auth;

if (! function_exists('get_logo_sucursal')) {

    /**
     * Obtiene la imagen en base64 del logo de la sucursal asociada a una compra.
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
            $logo = $compra->sucursales->logo;

            // Verifica si el logo tiene ya la ruta completa o solo el nombre del archivo
            $logoPath = public_path('assets/img/logosSucursales/' . basename($logo));

            /* Si el archivo existe, convertirlo a base64 */
            if (file_exists($logoPath)) {
                // Obtenemos el tipo de archivo (extensión)
                $type = pathinfo($logoPath, PATHINFO_EXTENSION);
                
                // Leer el archivo y codificarlo en base64
                $data = file_get_contents($logoPath);
                
                // Retornar la cadena base64 para la imagen
                return 'data:image/' . $type . ';base64,' . base64_encode($data);
            } else {
                // Si no se encuentra el archivo, retornar un mensaje de error
                return 'Archivo logo no encontrado en la ruta ' . $logoPath;
            }
        }

        /* Si no se encuentra la sucursal o el logo, retornar null */
        return null;
    }

}

//Implementacion de get logo empresa, segun el usuario atenticado
function getLogoSucursal(){
    $empresa_id = Auth::user()->empresa_id;
    $sucursal_id = Auth::user()->sucursal_id;
    /* Obtenemos la compra por ID */
    $sucursal = Sucursal::where('id', $sucursal_id)->where('empresa_id', $empresa_id)->select()->first();

    /* Si la compra existe y tiene una sucursal asociada */
    if ($sucursal) {
        $logo = $sucursal['logo'];

        // Verifica si el logo tiene ya la ruta completa o solo el nombre del archivo
        $logoPath = public_path('assets/img/logosSucursales/' . basename($logo));

        /* Si el archivo existe, convertirlo a base64 */
        if (file_exists($logoPath)) {
            // Obtenemos el tipo de archivo (extensión)
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            
            // Leer el archivo y codificarlo en base64
            $data = file_get_contents($logoPath);
            
            // Retornar la cadena base64 para la imagen
            return 'data:image/' . $type . ';base64,' . base64_encode($data);
        } else {
            // Si no se encuentra el archivo, retornar un mensaje de error
            return 'Archivo logo no encontrado en la ruta ' . $logoPath;
        }
    }

    /* Si no se encuentra la sucursal o el logo, retornar null */
    return null;    
}

