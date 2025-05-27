import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import FormCategoria from './Modal/FormCategoria';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Index({ auth }) {

    const permissions = auth.permissions || [];

    const can = (permissionName) => permissions.includes(permissionName);


    const [showModal, setShowModal] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [categoriaToEdit, setCategoriaToEdit] = useState(null);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get(route('categorias.all'), {
                params: {
                    page: currentPage,
                    per_page: perPage,
                },
            });
            setCategorias(response.data.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, [currentPage, perPage]);

    const filteredCategorias = categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: '#',
            selector: (row, index) => filteredCategorias.length - index,
            sortable: true,
            width: '10%',
            center: true
        },
        {
            name: 'Código',
            selector: row => row.codigo,
            sortable: true,
            width: '15%',
            center: true
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            width: '30%',
            center: true
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            sortable: true,
            width: '30%',
            center: true
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="text-center">
                    {can('category_edit') && (
                        <Button variant="outline-info" size="sm" onClick={() => handleEdit(row)}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                    )}

                    {can('category_delete') && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)} className="ms-1">
                            <i className="bi bi-trash"></i>
                        </Button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '15%',
            center: true
        },
    ];

    const handleEdit = (categoria) => {
        setEditMode(true);
        setCategoriaToEdit(categoria);
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
                axios.delete(route('categoria.delete', id))
                    .then((response) => {
                        Swal.fire(
                            'Eliminado!',
                            response.data.success || 'La categoría ha sido eliminada.',
                            'success'
                        );
                        fetchCategorias();
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Error',
                            err.response?.data?.error || 'Hubo un problema al eliminar la categoría.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditMode(false);
        setCategoriaToEdit(null);
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Categorías" />
            <FormCategoria
                title={editMode ? "Editar Categoría" : "Registrar nueva categoría"}
                showModal={showModal}
                setShowModal={setShowModal}
                onCategoriaCreated={fetchCategorias}
                onClose={handleModalClose}
                editMode={editMode}
                categoriaToEdit={categoriaToEdit}
            />
            <Card>
                <Card.Header>
                    {can('category_create') && (
                        <Button onClick={() => {
                            setEditMode(false);
                            setCategoriaToEdit(null);
                            setShowModal(true);
                        }} variant='outline-success' size='sm'>
                            <i className="bi bi-plus-circle"></i> Nueva categoría
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
                        data={filteredCategorias}
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
