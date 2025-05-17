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
import ModalNotificaciones from './Modal/ModalNotificaciones';

export default function Index({ auth, proveedores, pedidos, sucursales }) {

    const permissions = auth.permissions || [];
    const can = (permissionName) => permissions.includes(permissionName);

    const [showModal, setShowModal] = useState(false);
    const [compras, setCompras] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState(false);
    const [compra, setCompra] = useState({});
    const [notificaciones, setNotificaciones] = useState([]);
    const [showNotiModal, setShowNotiModal] = useState(false);

    const fetchCompras = async () => {
        try {
            const response = await axios.get(route('compras.getDataCompras'));
            const comprasData = response.data.data;
            setCompras(comprasData);

            const notified = JSON.parse(localStorage.getItem('compras_notificadas') || '[]');

            const nuevasNotificadas = comprasData.filter(compra =>
                (compra.estado === 'PAGADO' || compra.estado === 'CANCELADO') &&
                !notified.includes(compra.id)
            );

            if (nuevasNotificadas.length > 0) {
                setNotificaciones(nuevasNotificadas);
                setShowNotiModal(true);

                const nuevosIds = nuevasNotificadas.map(c => c.id);
                localStorage.setItem('compras_notificadas', JSON.stringify([...notified, ...nuevosIds]));
            }

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

    const sendCompraFinanza = (id) => {
        Swal.fire({
            title: "¿Confirmar envío?",
            text: "¿Estás seguro de que deseas enviar esta compra a finanzas?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, enviar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(route('compras.enviar.finanza'), { compra_id: id })
                    .then((response) => {
                        if (response.data.status === "success") {
                            Swal.fire({
                                title: "Éxito",
                                text: response.data.message,
                                icon: "success"
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.data.message,
                                icon: "error"
                            });
                        }
                    }).catch((err) => {
                        Swal.fire({
                            title: "Error",
                            text: "Ha ocurrido un error, intente nuevamente mas tarde.",
                            icon: "error"
                        });
                        console.log(err);
                    })
            }
        });
    }


    const sendPedidoBodega = (id) => {
        Swal.fire({
            title: "¿Confirmar envío?",
            text: "¿Estás seguro de que deseas enviar esta compra a bodega?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, enviar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(route('compras.senPedidoBodega'), { compra_id: id })
                    .then((response) => {
                        if (response.data.status === "success") {
                            Swal.fire({
                                title: "Éxito",
                                text: response.data.message,
                                icon: "success"
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.data.message,
                                icon: "error"
                            });
                        }
                    }).catch((err) => {
                        Swal.fire({
                            title: "Error",
                            text: "Ha ocurrido un error, intente nuevamente mas tarde.",
                            icon: "error"
                        });
                        console.log(err);
                    })
            }
        });
    }


    //Editar compra
    const editingCompra = (id) => {
        setShowModal(true);
        setEditing(true);
        axios.post(route('compras.data.obtener'), { compra_id: id })
            .then((response) => {
                setCompra(response.data);
            }).catch((err) => {
                console.log(err);
            })
    }

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
            width: '5%',
            center: true,
        },
        {
            name: 'Código',
            selector: row => row.codigo,
            sortable: true,
            width: '10%',
            center: true
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            width: '20%',
            center: true
        },
        {
            name: 'Proveedor',
            selector: row => row.proveedor,
            sortable: true,
            width: '15%',
            center: true
        },
        {
            name: 'Sucursal',
            selector: row => row.sucursal,
            sortable: true,
            width: '20%',
            center: true
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            sortable: true,
            width: '10%',
            center: true
        },
        {
            name: 'Acciones',
            width: '20%',
            center: true,
            cell: row => (
                <div className="d-flex align-items-center">
                    {
                        row.estado !== "Pendiente" ? (
                            <>
                                <Button
                                    variant="outline-info"
                                    title="Editar compra"
                                    size="sm"
                                    onClick={() => editingCompra(row.id)}
                                >
                                    <i className="bi bi-bag-plus"></i>
                                </Button>{' '}
                                <Button
                                    variant="outline-info mx-2"
                                    title="Enviar compra a finanzas"
                                    size="sm"
                                    onClick={() => sendCompraFinanza(row.id)}
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
                                {can('compras_delete') && (
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
                                )}
                            </>
                        ) : (
                            <>
                                {
                                    row.pedido_estado !== 'APROBADO' && (
                                        <Button
                                            variant="outline-dark mx-2"
                                            title="Enviar notificación a bodega"
                                            size="sm"
                                            onClick={() => sendPedidoBodega(row.id)}
                                        >
                                            <i className="bi bi-bell"></i>
                                        </Button>
                                    )
                                }
                                <Button
                                    variant="outline-info mx-2"
                                    title="Imprimir detalles de la compra"
                                    size="sm"
                                    onClick={() => showPDF(row.id)}
                                >
                                    <i className="bi bi-filetype-pdf"></i>
                                </Button>
                            </>
                        )
                    }
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
            {
                editing ? (
                    <FormCompra
                        title="Registrar nueva compra"
                        showModal={showModal}
                        setShowModal={setShowModal}
                        onCompraCreated={fetchCompras}
                        onClose={handleModalClose}
                        proveedores={proveedores}
                        pedidos={pedidos}
                        sucursales={sucursales}
                        compra={compra}
                        editing={editing}
                        setEditing={setEditing}
                    />
                ) : (
                    <FormCompra
                        title="Editar compra"
                        showModal={showModal}
                        setShowModal={setShowModal}
                        onCompraCreated={fetchCompras}
                        onClose={handleModalClose}
                        proveedores={proveedores}
                        pedidos={pedidos}
                        sucursales={sucursales}
                        editing={editing}
                        setEditing={setEditing}
                    />
                )
            }

            <ModalNotificaciones
                show={showNotiModal}
                onClose={() => setShowNotiModal(false)}
                compras={notificaciones}
            />

            <Card>
                <Card.Header>
                    {can('compras_create') && (
                        <Button onClick={() => {
                            setEditing(false);
                            setShowModal(true);
                        }} variant='outline-success' size='sm'>
                            <i className="bi bi-plus-circle"></i> Nueva compra
                        </Button>
                    )}
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
