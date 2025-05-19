<?php

namespace App\Services;

use App\Models\Inventarios\HistorialMovimiento;
use Illuminate\Support\Facades\Auth;

class GenerateCode
{
    public static function generarMov($prefijo = '')
    {
        $anio = date('y'); // año en dos dígitos
        $mes = date('m');  // mes en dos dígitos

        // Obtenemos el último movimiento con código que empiece por $prefijo
        $mov = HistorialMovimiento::where('codigo', 'like', "{$prefijo}-%")
            ->orderBy('id', 'desc')
            ->first();

        if ($mov && isset($mov->codigo)) {
            $partes = explode('-', $mov->codigo);

            if (count($partes) < 2) {
                // Código no tiene guion o mal formado, empezamos desde 1
                $increment = 1;
            } else {
                // Suponemos formato: PREFIJO-YYMMXXXX
                // Extraemos la parte numérica (XXXX)
                // $partes[1] es "YYMMXXXX", extraemos los últimos 4 caracteres
                $numeroStr = substr($partes[1], 4); // cambiar 4 si tu formato varía

                // Convertimos a entero y sumamos 1
                $increment = (int)$numeroStr + 1;
            }
        } else {
            // No hay movimientos previos, empezamos desde 1
            $increment = 1;
        }

        // Formateamos el incremento con ceros a la izquierda (4 dígitos)
        $incrementStr = str_pad($increment, 4, '0', STR_PAD_LEFT);

        // Construimos el código final
        $codigo = "{$prefijo}-{$anio}{$mes}{$incrementStr}";

        return $codigo;
    }
}
