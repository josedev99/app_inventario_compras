import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import "./formCompra.css"
import { useState } from 'react';

export default function FormCompras({
    title, showModal, setShowModal, compra = {},
    proveedores,pedidos, sucursales, onCompraCreated
}) {
    const { data, setData, reset, processing } = useForm({
        nombre: compra?.nombre || '',
        fecha_compra: compra?.fecha_compra || '',
        proveedor_id: compra?.proveedor_id || '',
        sucursal_id: compra?.sucursal_id || '',
        codigo: compra?.codigo || '', 
        pedido_id: compra?.pedido_id || 0
    });

    const [productosPedido, setProductosPedido] = useState([]);

    useEffect(() => {
        if (compra && Object.keys(compra).length > 0) {
            const nuevoData = {
                nombre: compra.nombre || '', 
                fecha_compra: compra.fecha_compra || '',
                proveedor_id: compra.proveedor_id || 0,
                empresa_id: compra.empresa_id || '',
                sucursal_id: compra.sucursal_id || '',
                estado: compra.estado || 'PENDIENTE',
                codigo: compra.codigo || ''
            };

            /* Solo actualizar si los datos han cambiado */
            setData(nuevoData);
        }
    }, [compra, setData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            data.productos = JSON.stringify(productosPedido);
            const response = await axios.post(route('compras.storeCompra'), data);
            /* Manejo de respuesta exitosa */
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message || 'La compra se ha creado correctamente.',
                    confirmButtonText: 'Aceptar'
                });
                reset();
                setShowModal(false);
                if (onCompraCreated) onCompraCreated();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: response.data.message || 'No se pudo procesar la solicitud.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (err) {
            console.error('Error:', err);
            /* Aquí puedes manejar el error con más detalles, por ejemplo */
            if (err.response) {
                console.error('Error de respuesta:', err.response.data);
            }
            Swal.fire({
                title: '¡Error inesperado!',
                text: 'No se pudo procesar la solicitud.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };


    /* Asegurarse de que el array sea válido */
    const safeArray = (array) => Array.isArray(array) ? array : [];

    /* Función para obtener la opción seleccionada de un array de opciones (para Select) */
    const getSelectedOption = (array, id) => {
        return array.find(item => item.id === id);
    };

    const setNombreCompra = (nombrePedido)=>{
        setData('nombre', nombrePedido);
    }

    const loadProductosPedidos = (pedido_id)=>{
        axios.get(route('pedido.obtener.productos.id',btoa(pedido_id)))
        .then((response)=>{
            setProductosPedido(response.data);
        }).catch((err)=>{
            console.log(err);
        })
    }

    const handlePrecioUnit = (value, index) => {
        const nuevosProductos = [...productosPedido];
        nuevosProductos[index].precio_unit = value;
        setProductosPedido(nuevosProductos);
    };

    return (
        <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                            <div className="form-group m-0 p-0">
                                <label className='m-0' htmlFor='bodegas'>Seleccionar pedido</label>
                                <Select
                                    value={getSelectedOption(safeArray(pedidos), data.pedido_id) ? {
                                        value: data.pedido_id,
                                        label: getSelectedOption(safeArray(pedidos), data.pedido_id).nombre
                                    } : null}
                                    onChange={(option) => {
                                        setData('pedido_id', option ? option.value : '');
                                        setNombreCompra(option ? option.label.split(' - ')[1] : '');
                                        loadProductosPedidos(option ? option.value : 0);
                                    }}
                                    options={safeArray(pedidos).map(p => ({ value: p.id, label: `${p.fecha} - ${p.nombre}` }))}
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-4 mb-2">
                            <div className="form-group m-0 p-0">
                                <label className='m-0' htmlFor='fecha_compra'>Fecha de Compra</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={data.fecha_compra}
                                    onChange={(e) => setData('fecha_compra', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-8 mb-1">
                            <div className="form-group m-0 p-0">
                                <label className='m-0' htmlFor="nombre">Nombre de la compra: </label>
                                <input type="text" className='form-control' value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} required />
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-12 col-lg-6 mb-2">
                            <div className="form-group m-0 p-0">
                                <label className='m-0' htmlFor='proveedor'>Proveedor</label>
                                <Select
                                    value={getSelectedOption(safeArray(proveedores), data.proveedor_id) ? {
                                        value: data.proveedor_id,
                                        label: getSelectedOption(safeArray(proveedores), data.proveedor_id).nombre
                                    } : null}
                                    onChange={(option) => setData('proveedor_id', option ? option.value : '')}
                                    options={safeArray(proveedores).map(p => ({ value: p.id, label: p.nombre }))}
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 mb-2">
                            <div className="form-group m-0 p-0">
                                <label className='m-0' htmlFor='bodegas'>Bodegas</label>
                                <Select
                                    value={getSelectedOption(safeArray(sucursales), data.sucursal_id) ? {
                                        value: data.sucursal_id,
                                        label: getSelectedOption(safeArray(sucursales), data.sucursal_id).nombre
                                    } : null}
                                    onChange={(option) => setData('sucursal_id', option ? option.value : '')}
                                    options={safeArray(sucursales).map(s => ({ value: s.id, label: s.nombre }))}
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12">
                            <div className="table-custom-container">
                                <h2 className="table-custom-title mb-0" style={{ fontSize: '14px', textAlign: 'center' }}>Productos</h2>
                                <div className="table-custom-responsive">
                                    <table className="table-custom">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Código</th>
                                                <th>Unidad medida</th>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                                <th>Costo unit.</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productosPedido.length > 0 ?
                                                    productosPedido.map((item, index) => (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.codigo}</td>
                                                            <td>{item.Umedida}</td>
                                                            <td>{item.nombre}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                              <input
                                                                onChange={(e) => handlePrecioUnit(e.target.value, index)}
                                                                value={item.precio_unit || ''}
                                                                className="form-control"
                                                                type="number"
                                                                step={0.01}
                                                                min={0}
                                                                max={10000000}
                                                                style={{ width: '120px', height: '34px' }}
                                                                />
                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <div className="action-btn" onClick={() => deleteItem(index)} title="Eliminar">
                                                                    <i className="bi bi-trash"></i>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    :
                                                    (
                                                        <tr>
                                                            <td colSpan={6} style={{ textAlign: 'center' }}>Cargando...</td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end mt-3">
                        <button type="submit" disabled={processing} className="btn btn-outline-success btn-sm">
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
