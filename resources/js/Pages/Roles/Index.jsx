import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import FormRole from './Modal/FormRole';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Index({ auth }) {

    const permissions = auth.permissions || [];
    const can = (permissionName) => permissions.includes(permissionName);

    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState(null);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(route('roles.getRoles'), {
                params: {
                    page: currentPage,
                    per_page: perPage,
                },
            });
            setRoles(response.data.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error('Error al cargar los roles:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, [currentPage, perPage]);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {can('role_edit') && (
                        <Button variant="outline-info" size="sm" onClick={() => handleEdit(row)}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                    )}

                    {can('role_delete') && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)} className="ms-1">
                            <i className="bi bi-trash"></i>
                        </Button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleEdit = (role) => {
        setEditMode(true);
        setRoleToEdit(role);
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
                axios.delete(route('roles.deleteRole', id))
                    .then((response) => {
                        Swal.fire(
                            'Eliminado!',
                            response.data.success || 'el rol ha sido eliminado.',
                            'success'
                        );
                        fetchRoles();
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Error',
                            err.response?.data?.error || 'Hubo un problema al eliminar el role.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditMode(false);
        setRoleToEdit(null);
    };

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

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Roles" />
            <FormRole
                title={editMode ? "Editar role" : "Registrar nuevo role"}
                showModal={showModal}
                setShowModal={setShowModal}
                onRoleCreated={fetchRoles}
                onClose={handleModalClose}
                editMode={editMode}
                roleToEdit={roleToEdit}
            />
            <Card>
                <Card.Header>
                    {can('role_create') && (
                        <Button onClick={() => {
                            setEditMode(false);
                            setRoleToEdit(null);
                            setShowModal(true);
                        }} variant='outline-success' size='sm'>
                            <i className="bi bi-plus-circle"></i> Nuevo role
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
                        data={filteredRoles}
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
                        customStyles={customStyles}
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
