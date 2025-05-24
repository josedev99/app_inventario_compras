<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de stock actual</title>
    <style>
        body {
            font-family: Helvetica,sans-serif;
            font-size: 12px;
            color: #333;
            margin: 15px 20px;
        }

        h1, strong {
            color: #2c3e50;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th, td {
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

        footer {
            position: fixed;
            bottom: 20px;
            left: 30px;
            right: 30px;
            font-size: 11px;
            color: #666;
        }

        .footer-table td {
            border: none;
            padding-top: 10px;
            text-transform: uppercase;
        }

        .footer-table {
            width: 100%;
        }

        .footer-table td:first-child {
            width: 50%;
        }

        .footer-table td:last-child {
            width: 50%;
            text-align: right;
        }
    </style>
</head>
<body>

    <!-- ENCABEZADO -->
    <table class="header no-border">
        <tr>
            <td class="header-logo">
                @php
                    $logoBase64 = getLogoSucursal();
                @endphp
                @if ($logoBase64)
                    <img src="{{ $logoBase64 }}" alt="Logo" style="width: 150px;">
                @else
                    <p></p>
                @endif
            </td>
            <td class="header-title">
                {{ $empresa['nombre'] }} <br>
                INVENTARIO ACTUAL DE {{ $sucursal['nombre'] }}
            </td>
            <td class="header-info">
                <strong></strong>
            </td>
        </tr>
    </table>

    <table class="no-border">
        <tr>
            <td><strong>FECHA:</strong> {{ date('d/m/Y') }}</td>
            <td><strong>BODEGA:</strong> {{ $sucursal['nombre'] }}</td>
        </tr>
    </table>

    <!-- CUERPO DEL DOCUMENTO -->
    <table>
        <thead>
            <tr>
                <th style="text-align: center">#</th>
                <th style="text-align: center">CÓDIGO DE PRODUCTO</th>
                <th style="text-align: center">DESCRIPCIÓN</th>
                <th style="text-align: center">UNIDAD DE MEDIDA</th>
                <th style="text-align: center">STOCK</th>
                <th style="text-align: center">OBSERVACIONES</th>
            </tr>
        </thead>
        <tbody>
            @php
            $contador = 1;
            @endphp
            @foreach($invActual as $item)
            <tr>
                <td>{{ $contador }}</td>
                <td style="text-align: center">{{ $item->codigo }}</td>
                <td>{{ $item->nombre }}</td>
                <td style="text-align: center">{{ $item->Umedida }}</td>
                <td style="text-align: center">{{ $item->stock }}</td>
                <td style="text-align: center"></td>
                <th></th>
            </tr>
            @php
                $contador ++;    
            @endphp
            @endforeach
        </tbody>
    </table>

    <!-- FOOTER DEL DOCUMENTO -->
    <footer>
        <table class="footer-table">
            <tr>
                <td>Impreso por: {{ $user['nombre'] }}</td>
            </tr>
        </table>
    </footer>

</body>
</html>
