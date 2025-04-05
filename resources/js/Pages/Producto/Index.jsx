import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import FormProduct from './Modal/FormProduct';
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-responsive-dt';
import 'datatables.net-responsive-bs5';

DataTable.use(DT);

export default function Index({ auth, categorias }) {
    const [showModal, setShowModal] = useState(false);
    const [productos, setProductos] = useState([]);

    const handleEdit = (id) => {
        console.log('Editar producto con ID:', id);
        // Aquí abrís el modal, cargás datos, etc.
        setShowModal(true);
        // Podés cargar datos por ID si querés
    };
    
    const handleDelete = (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
        axios.delete(route('producto.delete', id))
            .then(() => {
                $('.display').DataTable().ajax.reload(null, false); // Recargar tabla
            })
            .catch(err => {
                console.error('Error al eliminar:', err);
            });
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Productos" />
            <FormProduct title="Registrar nuevo producto" showModal={showModal} setShowModal={setShowModal} categorias={categorias} />
            <Card>
                <Card.Header>
                    <Button onClick={() => setShowModal(true)} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Nuevo producto
                    </Button>
                </Card.Header>
                <Card.Body>
                    <DataTable
                        className="display"
                        options={{
                            processing: true,
                            serverSide: true,
                            responsive: true,
                            ajax: {
                                url: route('producto.all'),
                                type: 'GET',
                            },
                            columns: [
                                {
                                    data: null,
                                    render: (data, type, row, meta) => meta.row + 1,
                                    title: "#",
                                },
                                { data: 'codigo', title: 'Código',render: (data) => `<div class="text-center">${data}</div>` },
                                { data: 'nombre', title: 'Nombre' },
                                { data: 'unidad_medida', title: 'Unidad Medida' },
                                { data: 'costo', title: 'Costo', render: (data) => `<div class="text-end">${data}</div>` },
                                { data: 'categoria', title: 'Categoría' },
                                {
                                    data: null,
                                    title: "Acciones",
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row) {
                                        return `
                                            <div class="text-center">
                                                <button class="btn btn-sm btn-outline-info btn-edit" data-id="${row.id}">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${row.id}">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                    `;
                                    }
                                }
                            ],
                            drawCallback: function () {
                                // Editar
                                document.querySelectorAll('.btn-edit').forEach(btn => {
                                  btn.addEventListener('click', (e) => {
                                    console.log(e.currentTarget);
                                    const id = e.currentTarget.getAttribute('data-id');
                                    handleEdit(id); // Llama tu función de editar
                                  });
                                });
                              
                                // Eliminar
                                document.querySelectorAll('.btn-delete').forEach(btn => {
                                  btn.addEventListener('click', (e) => {
                                    const id = e.currentTarget.getAttribute('data-id');
                                    handleDelete(id); // Llama tu función de eliminar
                                  });
                                });
                            }
                        }}
                    >
                        <thead className='bg-dark text-light p-1 text-center'>
                            <tr>
                                <th>#</th>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Unidad Medida</th>
                                <th>Costo</th>
                                <th>Categoría</th>
                            </tr>
                        </thead>
                    </DataTable>
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
