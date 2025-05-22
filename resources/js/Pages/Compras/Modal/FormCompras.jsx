import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import "./formCompra.css";

export default function FormCompras({
    title, showModal, setShowModal, compra = {}, editing = false, setEditing = '',
    proveedores, pedidos, sucursales, onCompraCreated, newCompra, setNewCompra, reloadDt, setReloadDt
}) {
    const { data, setData, reset, processing } = useForm({
        id: compra?.id || '',
        nombre: compra?.nombre || '',
        fecha_compra: compra?.fecha_compra || '',
        proveedor_id: compra?.proveedor_id || '',
        sucursal_id: compra?.sucursal_id || '',
        pedido_id: compra?.pedido_id || 0,
        tipo_comprobante: compra?.tipo_comprobante || ''
    });

    const tipoComprobanteOptions = [
        { value: 'credito_fiscal', label: 'Crédito Fiscal' },
        { value: 'consumidor_final', label: 'Factura Consumidor Final' },
        { value: 'con_nit', label: 'Comprobante con NIT' },
        { value: 'otro', label: 'Otro' }
    ];

    const [productosPedido, setProductosPedido] = useState([]);

    useEffect(() => {
        if (editing && compra?.id) {
            const nuevoData = {
                id: compra.id,
                nombre: compra.nombre || '',
                fecha_compra: compra.fecha_compra || '',
                proveedor_id: compra.proveedor_id || 0,
                sucursal_id: compra.sucursal_id || 0,
                pedido_id: compra.pedido_id || 0,
                tipo_comprobante: compra.tipo_comprobante || ''
            };
            setData(prev => JSON.stringify(prev) !== JSON.stringify(nuevoData) ? nuevoData : prev);
            setProductosPedido(compra.detalle ?? []);
        }
        if (!editing && (!compra || Object.keys(compra).length === 0)) {
            reset();
            setProductosPedido([]);
        }
    }, [compra?.id, editing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            data.productos = JSON.stringify(productosPedido);
            let response = null;
            if (data.id && editing && newCompra === false) {
                response = await axios.post(route('compras.update'), data);
            } else {
                response = await axios.post(route('compras.storeCompra'), data);
            }
            if (response.data.status === 'success') {
                setEditing(false);
                setNewCompra(false);
                setReloadDt(true);
                Swal.fire({ icon: 'success', title: 'Éxito', text: response.data.message, confirmButtonText: 'Aceptar' });
                reset();
                setShowModal(false);
                onCompraCreated?.();
                setProductosPedido([]);
            } else {
                Swal.fire({ icon: 'error', title: '¡Error!', text: response.data.message, confirmButtonText: 'Aceptar' });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ title: '¡Error inesperado!', text: 'No se pudo procesar la solicitud.', icon: 'error', confirmButtonText: 'Aceptar' });
        }
    };

    const safeArray = (array) => Array.isArray(array) ? array : [];
    const getSelectedOption = (array, id) => array.find(item => item.id === id);

    const setNombreCompra = (nombrePedido) => setData('nombre', nombrePedido);
    const loadProductosPedidos = (pedido_id) => {
        axios.get(route('pedido.obtener.productos.id', btoa(pedido_id)))
            .then((res) => setProductosPedido(res.data))
            .catch(console.log);
    };

    const handlePrecioUnit = (value, index) => {
        const nuevos = [...productosPedido];
        nuevos[index].precio_unit = value;
        setProductosPedido(nuevos);
    };

    const handleCantidadItem = (value, index) => {
        const nuevos = [...productosPedido];
        nuevos[index].cantidad = value;
        setProductosPedido(nuevos);
    };

    const deleteItem = (index) => {
        const nuevos = productosPedido.filter((_, i) => i !== index);
        setProductosPedido(nuevos);
    };

    return (
        <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} backdrop="static">
            <Modal.Header className='py-1' closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-2">
                            <label className='m-0'>Seleccionar pedido</label>
                            <Select
                                value={getSelectedOption(safeArray(pedidos), data.pedido_id) ? {
                                    value: data.pedido_id,
                                    label: getSelectedOption(pedidos, data.pedido_id).nombre
                                } : null}
                                onChange={(option) => {
                                    setData('pedido_id', option?.value || '');
                                    setNombreCompra(option?.label.split(' - ')[1] || '');
                                    loadProductosPedidos(option?.value || 0);
                                }}
                                options={pedidos.map(p => ({ value: p.id, label: `${p.fecha} - ${p.nombre}` }))}
                                isClearable
                                required
                            />
                        </div>

                        <div className="col-lg-4 mb-2">
                            <label className='m-0'>Fecha de Compra</label>
                            <input
                                type="date"
                                className="form-control"
                                value={data.fecha_compra}
                                onChange={(e) => setData('fecha_compra', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-8 mb-2">
                            <label className='m-0'>Nombre de la compra</label>
                            <input
                                type="text"
                                className='form-control'
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-6 mb-2">
                            <label className='m-0'>Proveedor</label>
                            <Select
                                value={getSelectedOption(proveedores, data.proveedor_id) ? {
                                    value: data.proveedor_id,
                                    label: getSelectedOption(proveedores, data.proveedor_id).nombre
                                } : null}
                                onChange={(option) => setData('proveedor_id', option?.value || '')}
                                options={proveedores.map(p => ({ value: p.id, label: p.nombre }))}
                                isClearable
                                required
                            />
                        </div>

                        <div className="col-lg-6 mb-2">
                            <label className='m-0'>Sucursal</label>
                            <Select
                                value={getSelectedOption(sucursales, data.sucursal_id) ? {
                                    value: data.sucursal_id,
                                    label: getSelectedOption(sucursales, data.sucursal_id).nombre
                                } : null}
                                onChange={(option) => setData('sucursal_id', option?.value || '')}
                                options={sucursales.map(s => ({ value: s.id, label: s.nombre }))}
                                isClearable
                                required
                            />
                        </div>

                        <div className="col-lg-6 mb-2">
                            <label className='m-0'>Tipo de comprobante</label>
                            <Select
                                value={tipoComprobanteOptions.find(opt => opt.value === data.tipo_comprobante) || null}
                                onChange={(option) => setData('tipo_comprobante', option?.value || '')}
                                options={tipoComprobanteOptions}
                                isClearable
                                required
                            />
                        </div>

                        <div className="col-12">
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
                                            {productosPedido.length > 0 ? productosPedido.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.codigo}</td>
                                                    <td>{item.Umedida}</td>
                                                    <td>{item.nombre}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <input type="number" step={0.01} min={1} max={10000000}
                                                            className="form-control" style={{ width: '120px', height: '34px' }}
                                                            value={item.cantidad || ''} onChange={(e) => handleCantidadItem(e.target.value, index)} />
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <input type="number" step={0.01} min={0} max={10000000}
                                                            className="form-control" style={{ width: '120px', height: '34px' }}
                                                            value={item.precio_unit || ''} onChange={(e) => handlePrecioUnit(e.target.value, index)} />
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className="action-btn" onClick={() => deleteItem(index)} title="Eliminar">
                                                            <i className="bi bi-trash"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={7} style={{ textAlign: 'center' }}>Sin productos...</td>
                                                </tr>
                                            )}
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
