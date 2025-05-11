import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Partials/Sidebar';
import Nav from '@/Components/Partials/Nav';
import { Card, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ViewDetails = ({ auth, compras }) => {

    const handleGeneratePDF = async (e) => {
        e.preventDefault();

        if (compras.detalles.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin detalles',
                text: 'Debes agregar al menos un detalle antes de guardar.',
            });
            return;
        }

        try {
            const response = await axios.get(route('compras.generarReportePdfDetalleCompras', compras.id), {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');

            Swal.fire({
                icon: 'success',
                title: 'PDF generado',
                text: 'Se generó correctamente el PDF de la compra.',
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al generar el PDF. Intenta nuevamente.',
            });
        }
    };



    const handleGenerateExcel = (e) => {
        e.preventDefault();
        if (compras.detalles.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin detalles',
                text: 'Debes agregar al menos un detalle antes de exportar.',
            });
            return;
        }

        try {
            const url = route('compras.generarReporteExcel', compras.id);
            window.open(url, '_blank');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo generar el Excel.',
            });
        }
    }



    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Detalle de Compra" />

            <Card className="m-4 shadow-sm border-0">
                <Card.Body className="bg-light rounded">
                    <h5 className="fw-semibold text-dark mb-4">
                        <i className="bi bi-receipt me-2 text-primary"></i>
                        Detalles de la Compra #{compras.id}
                    </h5>

                    <div className="row">
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Orden N°</Form.Label>
                            <Form.Control value={compras.id} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Codigo</Form.Label>
                            <Form.Control value={compras.codigo} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Fecha de Compra</Form.Label>
                            <Form.Control value={compras.fecha_compra} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Control value={compras.proveedores?.nombre || ''} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Control value={compras.empresas?.nombre || ''} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Sucursal</Form.Label>
                            <Form.Control value={compras.sucursales?.nombre || ''} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control value={compras.estado} disabled />
                        </div>
                        <div className="col-sm-6 mb-3">
                            <Form.Label>Usuario encargado</Form.Label>
                            <Form.Control value={compras.users?.nombre || ''} disabled />
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="m-4 mt-4">
                <Card.Header>
                    <h5>Detalles Agregados</h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-sm">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Costo Unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compras.detalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td>{detalle.productos?.nombre || 'Producto no disponible'}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>${detalle.costo_unitario}</td>
                                        <td>${detalle.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {compras.detalles.length === 0 && <p className="text-muted">No hay detalles registrados.</p>}
                        <div className="d-flex justify-content-center gap-2 mb-3">
                            <Button variant="danger" size="sm" onClick={handleGeneratePDF}>
                                Generar PDF <i className="bi bi-file-earmark-pdf-fill ms-1"></i>
                            </Button>
                            <Button variant="success" size="sm" onClick={handleGenerateExcel}>
                                Generar Excel <i className="bi bi-file-earmark-excel-fill ms-1"></i>
                            </Button>
                            <Button variant="danger" size="sm" onClick={handleGeneratePDF}>
                                Enviar a Finanzas <i className="bi bi-file-earmark-pdf-fill ms-1"></i>
                            </Button>
                            <Link
                                href={route('compras.index')}
                                title="Regresar"
                                className="btn btn-outline-dark btn-sm d-flex align-items-center"
                            >
                                <i className="bi bi-arrow-left me-1"></i> Regresar
                            </Link>
                        </div>

                    </div>
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
};

export default ViewDetails;
