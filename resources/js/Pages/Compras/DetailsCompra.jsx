import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Partials/Sidebar';
import Nav from '@/Components/Partials/Nav';
import Swal from 'sweetalert2';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';

const DetailsCompra = ({ auth, oc, productos }) => {
    const [formData, setFormData] = useState({
        compra_id: oc.id || '',
        producto_id: '',
        costo_unitario: '',
        cantidad: '',
        total: ''
    });

    const [detalles, setDetalles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value,
        };

        const cantidad = parseFloat(updatedFormData.cantidad);
        const costo = parseFloat(updatedFormData.costo_unitario);

        if (!isNaN(cantidad) && !isNaN(costo)) {
            updatedFormData.total = (cantidad * costo).toFixed(2);
        } else {
            updatedFormData.total = '';
        }

        setFormData(updatedFormData);
    };

    const handleSubmitDetalles = (e) => {
        e.preventDefault();
        if (!formData.producto_id || !formData.cantidad || !formData.costo_unitario || !formData.total) {
            Swal.fire({
                title: 'Upssss',
                text: 'Tienes que completar todos los campos',
                icon: 'error'
            });

            return;
        }

        setDetalles(prev => [...prev, { ...formData }]);


        setFormData({
            compra_id: oc.id,
            producto_id: '',
            cantidad: '',
            costo_unitario: '',
            total: '',
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (detalles.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin detalles',
                text: 'Debes agregar al menos un detalle antes de guardar.',
            });
            return;
        }

        try {
            const response = await axios({
                url: route('compras.stroreDetalleCompra'),
                method: 'POST',
                /* esto es muy importante para poder recibir archivos binarios */
                responseType: 'blob',
                data: {
                    compra_id: oc.id,
                    detalles: detalles.map(d => ({
                        ...d,
                        empresa_id: oc.empresas?.id,
                        sucursal_id: oc.sucursales?.id,
                    }))
                }
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            /* esto lo abre automaticamente una nueva pestaña para el pdf */
            window.open(url, '_blank');

            Swal.fire({
                icon: 'success',
                title: 'Compra guardada',
                text: 'La compra y sus detalles fueron registrados correctamente.',
            });

            setTimeout(() => {
                window.location.href = '/compras';
            }, 2000);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al guardar la compra. Verifica los datos e intenta nuevamente.',
            });
        }
    };


    const safeArray = (array) => Array.isArray(array) ? array : [];

    const getSelectedOption = (array, id) => {
        return array.find(item => item.id === id);
    }

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Agregar Detalles de Compra" />

            {/* card para resumen de compra */}
            <Card className="m-4 mb-0 shadow-sm border-0">
                <Card.Body className="bg-light rounded">
                    <h5 className="fw-semibold text-dark mb-4">
                        <i className="bi bi-info-circle me-2 text-primary"></i>
                        Información de la Compra <span>{oc.id}</span>
                    </h5>

                    <div className="alert alert-warning d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                            <strong>¡Atención!</strong> A continuación deberás completar todos los detalles de la orden de compra para la compra <strong>{oc.id}</strong>. Si tienes dudas, no dudes en contactar con soporte.
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Orden N°</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.id}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Codigo de compra</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.codigo}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Fecha de Compra</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.fecha_compra}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.proveedores?.nombre || ''}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.empresas?.nombre || ''}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Sucursal</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.sucursales?.nombre || ''}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.estado}
                                disabled
                                className="bg-white"
                            />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Usuario encargado</Form.Label>
                            <Form.Control
                                type="text"
                                value={oc.users?.nombre || ''}
                                disabled
                                className="bg-white"
                            />
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* card para el formulario */}
            <Card className="m-4 mt-4">
                <Card.Header>
                    <h5>Agregar Detalles de Compra</h5>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmitDetalles}>
                        <Row>
                            <Col sm={6} className="mb-3">
                                <Form.Label>Producto</Form.Label>
                                <Select
                                    value={getSelectedOption(safeArray(productos), formData.producto_id) ? {
                                        value: formData.producto_id,
                                        label: getSelectedOption(safeArray(productos), formData.producto_id).nombre
                                    } : null}
                                    onChange={(option) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            producto_id: option ? option.value : ''
                                        }))
                                    }
                                    options={safeArray(productos).map(s => ({ value: s.id, label: s.nombre }))}
                                    isClearable
                                />

                            </Col>
                            <Col sm={6} className="mb-3">
                                <Form.Label>Costo Unitario</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="costo_unitario"
                                    value={formData.costo_unitario}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6} className="mb-3">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col sm={6} className="mb-3">
                                <Form.Label>Total</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="total"
                                    value={formData.total}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Row>

                        <Button type="submit" variant="primary">
                            Agregar Detalle
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <div className="table-responsive">
                        <table className="table table-stripe table-bordered table-md">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Costo Unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((detalle, index) => {
                                    const producto = productos.find(p => p.id === parseInt(detalle.producto_id));
                                    return (
                                        <tr key={index}>
                                            <td>{producto?.nombre || 'Producto no encontrado'}</td>
                                            <td>{detalle.cantidad}</td>
                                            <td>${detalle.costo_unitario}</td>
                                            <td>${detalle.total}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {detalles.length > 0 && (
                            <Button variant="success" onClick={handleSubmit}>
                                Guardar esta compra
                            </Button>
                        )}
                    </div>
                </Card.Footer>
            </Card>
        </AuthenticatedLayout>
    );
};

export default DetailsCompra;
