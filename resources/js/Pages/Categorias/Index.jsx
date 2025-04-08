import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, FormControl } from 'react-bootstrap';
import FormCategoria from './Modal/FormCategoria';
import DataTable from 'react-data-table-component';
import axios from 'axios';


export default function Index({ auth }) {
    const [showModal, setShowModal] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0); // Guardar el total de registros

    // Función para obtener los datos con paginación
    const fetchCategorias = async () => {
        try {
            const response = await axios.get(route('categorias.all'), {
                params: {
                    page: currentPage,
                    per_page: perPage,
                },
            });
            setCategorias(response.data.data);
            setTotalRows(response.data.total); // Guardar total de registros
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, [currentPage, perPage]);

    // Filtrado de búsqueda
    const filteredCategorias = categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Columnas del DataTable
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
            name: 'Descripción',
            selector: row => row.descripcion,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="text-center">
                    <Button variant="outline-info" size="sm" onClick={() => handleEdit(row.id)}>
                        <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleEdit = (id) => {
        console.log('Editar categoría con ID:', id);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            axios.delete(route('categoria.delete', id))
                .then(() => fetchCategorias())
                .catch(err => console.error('Error al eliminar:', err));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Categorías" />
            <FormCategoria
                title="Registrar nueva categoría"
                showModal={showModal}
                setShowModal={setShowModal}
                onCategoriaCreated={fetchCategorias}
            />
            <Card>
                <Card.Header>
                    <Button onClick={() => setShowModal(true)} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Nueva categoría
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
                        paginationComponentOptions={{ noRowsPerPage: false }} // Asegura que se muestren números
                        responsive
                        highlightOnHover
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
