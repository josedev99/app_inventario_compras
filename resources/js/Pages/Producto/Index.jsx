import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InfoPage from "@/Components/Partials/InfoPage";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card, Form, Table } from 'react-bootstrap';
import { useState } from 'react';
import FormProduct from './Modal/FormProduct';

export default function Index({ auth,categorias }) {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
                <Head title="Productos" />
                <FormProduct title={"Registrar nuevo producto"} showModal={showModal} setShowModal={setShowModal} categorias={categorias} />
                <Card >
                    <Card.Header>
                        <Button onClick={() => setShowModal(true)} variant='outline-success' size='sm' ><i className="bi bi-plus-circle"></i> Nuevo producto</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th style={{padding: '1px !important'}}>#</th>
                                    <th style={{padding: '1px !important'}}>Código</th>
                                    <th style={{padding: '1px !important'}}>Nombre</th>
                                    <th style={{padding: '1px !important'}}>Unidad medida</th>
                                    <th style={{padding: '1px !important'}}>Costo unitario</th>
                                    <th style={{padding: '1px !important'}}>Acciones</th>
                                </tr>
                            </thead>
                        </Table>
                    </Card.Body>
                </Card>

            </AuthenticatedLayout>
        </>
    )
}
