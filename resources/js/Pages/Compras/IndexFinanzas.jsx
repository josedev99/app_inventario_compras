import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Index({ auth, proveedores, pedidos, sucursales }) {

    const permissions = auth.permissions || [];
    const can = (permissionName) => permissions.includes(permissionName);

    const [showModal, setShowModal] = useState(false);
    const [compras, setCompras] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState(false);
    const [compra, setCompra] = useState({});

    const fetchCompras = async () => {
        try {
            const response = await axios.get(route('compras.obtenerCompraporFinanzas'));
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

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#343a40',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.4rem',
            },
        },
    };

    const showPDF = (id) => {
        window.open(route('compras.generarReportePdfDetalleCompras', btoa(id)), '_blank');
    }

    const sendCompraFinanzaEstado = (id) => {
        Swal.fire({
            title: "Cambiar estado de la compra",
            input: "select",
            inputOptions: {
                "PAGADO": "PAGADO",
                "CANCELADO": "CANCELADO",
            },
            inputPlaceholder: "Selecciona un estado",
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value) {
                    return "Debes seleccionar un estado";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(route('compras.estadoCompraUpdate'), {
                    compra_id: id,
                    estado: result.value
                })
                    .then((response) => {
                        if (response.data.status === "success") {
                            Swal.fire("Éxito", response.data.message, "success");
                            fetchCompras();
                        } else {
                            Swal.fire("Error", response.data.message, "error");
                        }
                    })
                    .catch((err) => {
                        Swal.fire("Error", "Ha ocurrido un error, intente nuevamente más tarde.", "error");
                        console.error(err);
                    });
            }
        });
    };


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
                    {
                        row.estado !== "PAGADO" ? (
                            <>
                                <Button
                                    variant="outline-info mx-2"
                                    title="Cambiar estado de la compra"
                                    size="sm"
                                    onClick={() => sendCompraFinanzaEstado(row.id)}
                                >
                                    <i className="bi bi-check-circle"></i>
                                </Button>{' '}
                                <Button
                                    variant="outline-info"
                                    title="Imprimir detalles de la compra"
                                    size="sm"
                                    onClick={() => showPDF(row.id)}
                                >
                                    <i className="bi bi-filetype-pdf"></i>
                                </Button>{' '}
                            </>
                        ) : (
                            <Button
                                variant="outline-info mx-2"
                                title="Imprimir detalles de la compra"
                                size="sm"
                                onClick={() => showPDF(row.id)}
                            >
                                <i className="bi bi-filetype-pdf"></i>
                            </Button>
                        )
                    }
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];


    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Compras" />
            <Card>
                <Card.Header>
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
                        customStyles={customStyles}
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
