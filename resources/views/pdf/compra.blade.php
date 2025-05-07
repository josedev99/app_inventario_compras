<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Compra #{{ $compras->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 30px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #555;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .logo {
            width: 120px;
        }

        h2 {
            margin: 0;
            font-size: 20px;
            color: #2c3e50;
        }

        .info {
            margin-bottom: 15px;
        }

        .info p {
            margin: 4px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th {
            background-color: #f2f2f2;
            border: 1px solid #999;
            padding: 8px;
            text-align: left;
        }

        td {
            border: 1px solid #ccc;
            padding: 6px;
        }

        .total-row {
            font-weight: bold;
            background-color: #eef;
        }
    </style>
</head>

<body>
    <div class="header">
        <div>
            <h2>Compra #{{ $compras->id }}</h2>
            <p style="font-size: 14px;">Resumen de compra</p>
        </div>
        <div>
            @php
                $logo = get_logo_sucursal($compras->id);

                if ($logo && file_exists($logo)) {
                    $type = pathinfo($logo, PATHINFO_EXTENSION);
                    $data = file_get_contents($logo);
                    $logoBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                } else {
                    $logoBase64 = null;
                }
            @endphp

            @if ($logoBase64)
                <img src="{{ $logoBase64 }}" alt="Logo" style="width: 150px;">
            @else
                <p>Logo no disponible</p>
            @endif
        </div>
    </div>

    <div class="info">
        <p><strong>Proveedor:</strong> {{ $compras->proveedores->nombre ?? '-' }}</p>
        <p><strong>Fecha:</strong> {{ $compras->created_at->format('d/m/Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo Unitario</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @php $sumaTotal = 0; @endphp
            @foreach ($compras->detalles as $detalle)
                @php $sumaTotal += $detalle->total; @endphp
                <tr>
                    <td>{{ $detalle->productos->nombre }}</td>
                    <td>{{ $detalle->cantidad }}</td>
                    <td>${{ number_format($detalle->costo_unitario, 2) }}</td>
                    <td>${{ number_format($detalle->total, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3">Total General</td>
                <td>${{ number_format($sumaTotal, 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
