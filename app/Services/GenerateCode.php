<?php
namespace App\Services;

use App\Models\Inventarios\HistorialMovimiento;
use Illuminate\Support\Facades\Auth;

class GenerateCode{
    public static function generarMov($prefijo = ''){
        $empresa_id = Auth::user()->empresa_id;
        $anio = date('Y');
        $mes = date('m');

        $mov = HistorialMovimiento::where('empresa_id', $empresa_id)
            ->whereYear('created_at', $anio)
            ->whereMonth('created_at', $mes)
            ->orderBy('id','desc')
            ->first();
        if($mov){
            $increment = explode('-',$mov['codigo']);
            $increment = (int)substr($increment[1],6,strlen($increment[1])) + 1;
            $codigo = "{$prefijo}-{$anio}{$mes}{$increment}";

        }else{
            $codigo = "{$prefijo}-{$anio}{$mes}1";
        }
        return $codigo;
    }
}