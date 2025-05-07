<?php

namespace App\Exports;

use App\Models\Compra;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CompraDetallesExport implements FromCollection, WithHeadings
{
    protected $compra;

    public function __construct($compra)
    {
        $this->compra = $compra;
    }

    public function collection()
    {
        return collect($this->compra->detalles)->map(function ($detalle) {
            return [
                'ID Compra' => $this->compra->id,
                'Fecha de Compra' => $this->compra->fecha_compra,
                'Proveedor' => $this->compra->proveedores->nombre ?? '',
                'Empresa' => $this->compra->empresas->nombre ?? '',
                'Sucursal' => $this->compra->sucursales->nombre ?? '',
                'Usuario' => $this->compra->users->nombre ?? '',
                'Producto' => $detalle->productos->nombre ?? '',
                'Cantidad' => $detalle->cantidad,
                'Costo Unitario' => $detalle->costo_unitario,
                'Total' => $detalle->total,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID Compra',
            'Fecha de Compra',
            'Proveedor',
            'Empresa',
            'Sucursal',
            'Usuario',
            'Producto',
            'Cantidad',
            'Costo Unitario',
            'Total',
        ];
    }
}
