<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Resumen de Compra #{{ $compras->id }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 11px;
            margin: 25px;
            color: #444;
        }

        .title {
            font-size: 18px;
            margin-bottom: 10px;
            color: #1c1c1c;
        }

        .logo {
            width: 120px;
        }

        .section {
            margin-bottom: 20px;
        }

        .section h4 {
            margin-bottom: 6px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
            color: #2c3e50;
        }

        .section p {
            margin: 3px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #999;
            padding: 6px 8px;
            text-align: center;
        }

        th {
            background-color: #f0f0f0;
        }

        .footer {
            margin-top: 30px;
            font-style: italic;
            font-size: 10px;
            text-align: center;
            color: #999;
        }
    </style>
</head>

<body>

    <div class="title">Resumen Detallado de Compra #{{ $compras->id }}</div>

    <div>
        @php
            $logoBase64 = get_logo_sucursal($compras->id);
        @endphp



        @if ($logoBase64)
            <img src="{{ $logoBase64 }}" alt="Logo" style="width: 150px;">
        @else
            <p>Logo no disponible</p>
        @endif
    </div>






    <div class="section">
        <h4>Datos Generales</h4>
        <p><strong>Proveedor:</strong> {{ $compras->proveedores->nombre ?? '-' }}</p>
        <p><strong>Empresa:</strong> {{ $compras->empresas->nombre ?? '-' }}</p>
        <p><strong>Sucursal:</strong> {{ $compras->sucursales->nombre ?? '-' }}</p>
        <p><strong>Usuario:</strong> {{ $compras->users->nombre ?? '-' }}</p>
        <p><strong>Fecha de Compra:</strong> {{ $compras->created_at->format('d/m/Y H:i') }}</p>
    </div>

    <div class="section">
        <h4>Detalles de Productos</h4>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @php $total = 0; @endphp
                @foreach ($compras->detalles as $i => $detalle)
                    @php $total += $detalle->total; @endphp
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $detalle->productos->nombre }}</td>
                        <td>{{ $detalle->cantidad }}</td>
                        <td>${{ number_format($detalle->costo_unitario, 2) }}</td>
                        <td>${{ number_format($detalle->total, 2) }}</td>
                    </tr>
                @endforeach
                <tr>
                    <td colspan="4"><strong>Total General</strong></td>
                    <td><strong>${{ number_format($total, 2) }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">
        Este documento fue generado automáticamente el {{ now()->format('d/m/Y H:i') }}
    </div>

</body>

</html>
