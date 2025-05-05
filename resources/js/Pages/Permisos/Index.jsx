import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import FormPermiso from './Modal/FormPermiso';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Index({ auth }) {
    const [showModal, setShowModal] = useState(false);
    const [permisos, setPermisos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [permisoToEdit, setPermisoEdit] = useState(null);

    const fetchPermisos = async () => {
        try {
            const response = await axios.get(route('permisos.getPermisos'), {
                params: {
                    page: currentPage,
                    per_page: perPage,
                },
            });
            setPermisos(response.data.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error('Error al cargar los permisos:', error);
        }
    };

    useEffect(() => {
        fetchPermisos();
    }, [currentPage, perPage]);

    const filteredPermisos = permisos.filter(permiso =>
        permiso.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: row => row.name,
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

    const handleEdit = (permiso) => {
        setEditMode(true);
        setPermisoEdit(permiso);
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
                axios.delete(route('permisos.deletePermiso', id))
                    .then((response) => {
                        Swal.fire(
                            'Eliminado!',
                            response.data.success || 'el permiso ha sido eliminado.',
                            'success'
                        );
                        fetchPermisos();
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Error',
                            err.response?.data?.error || 'Hubo un problema al eliminar el permiso.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditMode(false);
        setPermisoEdit(null);
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Permisos" />
            <FormPermiso
                title={editMode ? "Editar permiso" : "Registrar nuevo permiso"}
                showModal={showModal}
                setShowModal={setShowModal}
                onPermisoCreated={fetchPermisos}
                onClose={handleModalClose}
                editMode={editMode}
                permisoToEdit={permisoToEdit}
            />
            <Card>
                <Card.Header>
                    <Button onClick={() => {
                        setEditMode(false);
                        setPermisoEdit(null);
                        setShowModal(true);
                    }} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Nuevo permiso
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
                        data={filteredPermisos}
                        pagination
                        paginationPerPage={perPage}
                        paginationRowsPerPageOptions={[5, 10, 25, 50]}
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={newPerPage => {
                            setPerPage(newPerPage);
                            setCurrentPage(1);
                        }}
                        onChangePage={page => setCurrentPage(page)}
                        responsive
                        highlightOnHover
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
