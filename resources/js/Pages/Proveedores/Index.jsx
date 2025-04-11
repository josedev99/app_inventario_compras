import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import FormProveedor from './Modal/FormProveedor';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Index({ auth }) {
    const [showModal, setShowModal] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [proveedorToEdit, setProveedorToEdit] = useState(null);

    // Obtener los proveedores
    const fetchProveedores = async () => {
        try {
            const response = await axios.get(route('proveedores.all'));
            setProveedores(response.data.data);
        } catch (error) {
            console.error('Error al cargar los proveedores:', error);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);


    const filteredProveedores = proveedores.filter(proveedor =>
        (proveedor.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="text-center">
                    <Button variant="outline-info" size="sm" onClick={() => handleEdit(row)}>
                        <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)} className="ms-1">
                        <i className="bi bi-trash"></i>
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleEdit = (proveedor) => {
        setEditMode(true);
        setProveedorToEdit(proveedor);
        setShowModal(true);
    };

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
                axios.delete(route('proveedores.delete', id))
                    .then((response) => {
                        Swal.fire(
                            'Eliminado!',
                            response.data.success || 'El proveedor ha sido eliminado.',
                            'success'
                        );
                        fetchProveedores();
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Error',
                            err.response?.data?.error || 'Hubo un problema al eliminar el proveedor.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditMode(false);
        setProveedorToEdit(null);
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Proveedores" />
            <FormProveedor
                title={editMode ? "Editar Proveedor" : "Registrar nuevo proveedor"}
                showModal={showModal}
                setShowModal={setShowModal}
                onProveedorCreated={fetchProveedores}
                onClose={handleModalClose}
                editMode={editMode}
                proveedorToEdit={proveedorToEdit}
            />
            <Card>
                <Card.Header>
                    <Button onClick={() => {
                        setEditMode(false);
                        setProveedorToEdit(null);
                        setShowModal(true);
                    }} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Nuevo proveedor
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
                        data={filteredProveedores}
                        pagination
                        responsive
                        highlightOnHover
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
