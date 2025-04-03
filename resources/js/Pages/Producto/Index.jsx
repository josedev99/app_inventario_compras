import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import FormProduct from './Modal/FormProduct';
import { CDBCard, CDBCardBody, CDBDataTable, CDBContainer } from 'cdbreact';
import axios from 'axios';

export default function Index({ auth, categorias }) {
    const [showModal, setShowModal] = useState(false);
    const [productos, setProductos] = useState([]);

    const getProducts = () => {
        axios.get(route('producto.all'))
            .then((response) => {
                setProductos(response.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleEdit = (id) => {
        console.log(`Editar producto ID: ${id}`);
        // Aquí puedes abrir un modal para editar
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            axios.delete(route('producto.delete', { id }))
                .then(() => {
                    getProducts();
                }).catch((err) => {
                    console.log(err);
                });
        }
    };

    const data = {
        columns: [
            { label: '#', field: 'id', width: 50, sort: 'asc' },
            { label: 'Código', field: 'codigo', width: 100, sort: 'asc' },
            { label: 'Nombre', field: 'nombre', width: 200, sort: 'asc' },
            { label: 'Unidad de Medida', field: 'Umedida', width: 150, sort: 'asc' },
            { label: 'Costo', field: 'costo', width: 100, sort: 'asc' },
            { 
                label: 'Acciones', 
                field: 'acciones', 
                width: 150, 
                sort: 'disabled' 
            }
        ],
        rows: productos.map((producto, index) => ({
            id: index + 1,
            codigo: producto.codigo,
            nombre: producto.nombre,
            Umedida: producto.Umedida,
            costo: `$${parseFloat(producto.costo).toFixed(2)}`,
            acciones: (
                <>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(producto.id)}>
                        <i className="bi bi-pencil"></i>
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(producto.id)}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </>
            )
        }))
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
                    <CDBContainer>
                        <CDBCard>
                            <CDBCardBody>
                                <CDBDataTable
                                    striped
                                    bordered
                                    hover
                                    scrollY
                                    maxHeight="50vh"
                                    data={data}
                                    searchTop={true} // Agrega esta línea
                                    searchBottom={false} // Puedes cambiar a `true` si quieres la barra abajo
                                    materialSearch
                                    className="table-hover table-striped no-footer dtr-inline dataTable"
                                />
                            </CDBCardBody>
                        </CDBCard>
                    </CDBContainer>
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
