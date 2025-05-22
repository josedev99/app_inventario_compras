<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Resumen de compra #{{ $compras->id }}</title>
    <style>
        body {
            font-family: Helvetica, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 15px 20px;
        }

        h1,
        strong {
            color: #2c3e50;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }

        th,
        td {
            padding: 6px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }

        th {
            background-color: #f0efef;
            color: #2c3e50;
            padding: 4px;
            border-bottom: 1px solid #dcdcdc;
        }

        .no-border td {
            border: none;
        }

        .header {
            margin-bottom: 10px;
        }

        .header-logo img {
            width: 80px;
        }

        .header-title {
            font-size: 13px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
        }

        .header-info {
            text-align: right;
            font-size: 12px;
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

    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="width: 33.33%"></td>
            <td style="width: 33.33%; text-align: center;">
                <b style="font-size: 14px">{{ $compras->sucursales->nombre ?? '-' }}</b> <br>
                {{ $compras->empresas->nombre ?? '-' }}
                <br><br>
                <span style="font-size: 13px">ORDEN DE COMPRA Nº {{ $compras->codigo }}</span>
            </td>
            <td style="width: 33.33%; text-align: center;">
                @php
                    $logoBase64 = get_logo_sucursal($compras->id);
                @endphp
                @if ($logoBase64)
                    <img src="{{ $logoBase64 }}" alt="Logo" style="width: 150px;">
                @else
                    <p></p>
                @endif
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td style="width: 50%"><strong>Fecha de compra:</strong>
                {{ optional($compras->created_at)->format('d/m/Y H:i') ?? '-' }}</td>
            <td style="width: 50%"><strong>Realizado por:</strong> {{ $compras->users->nombre ?? '-' }}</td>
            <td style="width: 50%"><strong>Estado:</strong> {{ $compras->estado ?? '-' }}</td>
            <td style="width: 50%"><strong>Tipo de comprobante:</strong> {{ $compras->tipo_comprobante ?? '-' }}</td>
        </tr>
    </table>

    <div class="section">
        <h4 style="text-align: center;">DETALLES</h4>
        <table>
            <thead>
                <tr>
                    <th style="text-align: center;">#</th>
                    <th style="text-align: center;">Descripción</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: center;">Unidad de medida</th>
                    <th style="text-align: center;">Precio unitario</th>
                    <th style="text-align: center;">Total</th>
                </tr>
            </thead>
            <tbody>
                @php $total = 0; @endphp
                @foreach ($compras->detalles as $i => $detalle)
                    @php $total += $detalle->total; @endphp
                    <tr>
                        <td style="text-align: center;">{{ $i + 1 }}</td>
                        <td>{{ $detalle->productos->nombre }}</td>
                        <td style="text-align: center;">{{ $detalle->cantidad }}</td>
                        <td style="text-align: center;">{{ $detalle->productos->Umedida }}</td>
                        <td style="text-align: right;">${{ number_format($detalle->costo_unitario, 2) }}</td>
                        <td style="text-align: right;">${{ number_format($detalle->total, 2) }}</td>
                    </tr>
                @endforeach
                <tr>
                    <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                    <td colspan="2" style="text-align: right;"><strong>${{ number_format($total, 2) }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">
        Este documento ha sido generado automáticamente el {{ now()->format('d/m/Y H:i') }}
    </div>

</body>

</html>
