<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Documento para el Pedido</title>
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
                <img src="ruta_del_logo.png" alt="LOGO EMPRESA">
            </td>
            <td class="header-title">
                {{ $empresa['nombre'] }} <br>
                REQUERIMIENTOS DEL PEDIDO
            </td>
            <td class="header-info">
                <strong>No. PEDIDO: </strong> {{ $pedido['codigo'] }}
            </td>
        </tr>
    </table>

    <table class="no-border">
        <tr>
            <td><strong>FECHA:</strong> {{ date('d/m/Y',strtotime($pedido['created_at'])) }}</td>
            <td><strong>OBRA:</strong> {{ $pedido['nombre'] }}</td>
        </tr>
    </table>

    <!-- CUERPO DEL DOCUMENTO -->
    <table>
        <thead>
            <tr>
                <th style="text-align: center">#</th>
                <th style="text-align: center">CÓDIGO</th>
                <th style="text-align: center">DESCRIPCIÓN</th>
                <th style="text-align: center">CANTIDAD</th>
                <th style="text-align: center">UNIDAD</th>
                <th style="text-align: center">BODEGA O LOCAL</th>
            </tr>
        </thead>
        <tbody>
            @php
            $contador = 1;
            @endphp
            @foreach($detalle_pedido as $item)
            <tr>
                <td>{{ $contador }}</td>
                <td style="text-align: center">{{ $item->codigo }}</td>
                <td>{{ $item->nombre }}</td>
                <td style="text-align: center">{{ $item->cantidad }}</td>
                <td>{{ $item->Umedida }}</td>
                <td>{{ $sucursal['nombre'] }}</td>
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
                <td>Realizado por: {{ $user['nombre'] }}</td>
                <td>Revisado por: {{ $user['nombre'] }}</td>
            </tr>
        </table>
    </footer>

</body>
</html>
