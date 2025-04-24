import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head, Link } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import FormCompra from './Modal/FormCompras';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Index({ auth, proveedores, empresas, sucursales }) {
    const [showModal, setShowModal] = useState(false);
    const [compras, setCompras] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchCompras = async () => {
        try {
            const response = await axios.get(route('compras.getDataCompras'));
            setCompras(response.data.data);
        } catch (error) {
            console.error('Error al cargar las compras:', error);
        }
    };

    useEffect(() => {
        fetchCompras();
    }, []);

    const filteredCompras = compras.filter(compra =>
        (compra.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (compra.proveedor || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Código',
            selector: row => row.codigo,
            sortable: true,
        },
        {
            name: 'Proveedor',
            selector: row => row.proveedor,
            sortable: true,
        },
        {
            name: 'Sucursal',
            selector: row => row.sucursal,
            sortable: true,
        },
        {
            name: 'Empresa',
            selector: row => row.empresa,
            sortable: true,
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="d-flex align-items-center">
                    {row.estado !== 'PAGADO' ? (
                        <Link
                            href={route('compras.adddetallesdeCompra', row.id)}
                            title="Agregar detalles de compra"
                            className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                            style={{
                                fontSize: '15px',
                                height: '32px',
                                width: '32px',
                                padding: '0',
                                lineHeight: '0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <i className="bi bi-journal-plus" style={{ fontSize: '15px' }}></i>
                        </Link>
                    ) : (
                        <Link
                            href={route('compras.viewDetailsCompras', row.id)}
                            title="Ver detalles"
                            className="btn btn-outline-warning d-flex align-items-center justify-content-center"
                            style={{
                                fontSize: '15px',
                                height: '32px',
                                padding: '0 10px',
                                lineHeight: '0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <i className="bi bi-journal-album" style={{ fontSize: '15px' }}></i>
                        </Link>
                    )}

                    <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(row.id)}
                        className="ms-1 d-flex align-items-center justify-content-center"
                        style={{
                            fontSize: '15px',
                            height: '32px',
                            width: '32px',
                            padding: '0',
                            lineHeight: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <i className="bi bi-trash" style={{ fontSize: '15px' }}></i>
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];


    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(route('compras.deleteCompra', id))
                    .then((response) => {
                        Swal.fire(
                            'Eliminado!',
                            response.data.success || 'La compra ha sido eliminada.',
                            'success'
                        );
                        fetchCompras();
                    })
                    .catch((err) => {
                        const errorMessage = err.response?.data?.message || 'Hubo un problema al tratar de eliminar la compra'
                        Swal.fire(
                            'Error',
                            errorMessage,
                            'error'
                        );
                    });
            }
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Compras" />
            <FormCompra
                title="Registrar nueva compra"
                showModal={showModal}
                setShowModal={setShowModal}
                onCompraCreated={fetchCompras}
                onClose={handleModalClose}
                proveedores={proveedores}
                empresas={empresas}
                sucursales={sucursales}
            />
            <Card>
                <Card.Header>
                    <Button onClick={() => setShowModal(true)} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Nueva compra
                    </Button>
                    <FormControl
                        type="text"
                        placeholder="Buscar..."
                        className="w-25 d-inline-block float-end"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Card.Header>
                <Card.Body>
                    <DataTable
                        columns={columns}
                        data={filteredCompras}
                        pagination
                        responsive
                        highlightOnHover
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
