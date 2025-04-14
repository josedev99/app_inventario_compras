import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FormUser from './Components/FormUser';

export default function Index({ auth, dataEmpresas,dataSucursales }) {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [empresas, setEmpresas] = useState([]);
    const [sucursales,setSucursales] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reloadDt,setReloadDt] = useState(false);
    const [editing,setEditing] = useState(false);

    const fetchUsers = async (page = 1, perPage = 10, search = '') => {
        const start = (page - 1) * perPage;

        try {
            const response = await axios.get(route('usuario.all'), {
                params: {
                    draw: 1,
                    start: start,
                    length: perPage,
                    'search[value]': search,
                },
            });
            setUsers(response.data.data);
            setTotalRows(response.data.recordsTotal);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, perPage, searchTerm);
        setEmpresas(dataEmpresas);
        setSucursales(dataSucursales);
        setReloadDt(false);
    }, [reloadDt]);

    const handlePageChange = page => {
        fetchUsers(page, perPage, searchTerm);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchUsers(page, newPerPage, searchTerm);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchUsers(1, perPage, value);
    };

    const handleEdit = id => {
        let userFind = users.find((item)=>parseInt(item.id) === parseInt(id));
        setUser(userFind);
        setShowModal(true);
        setEditing(true);
    };

    const handleDelete = id => {
        console.log("Eliminar usuario con ID:", id);
    };

    const columns = [
        { name: '#', selector: row => row.id, sortable: true, width: '5%', center: true },
        { name: 'Nombre', selector: row => row.nombre, sortable: true, width: '15%', center: true },
        { name: 'Teléfono', selector: row => row.telefono, sortable: true, width: '10%', center: true },
        { name: 'Usuario', selector: row => row.usuario, sortable: true, width: '10%', center: true },
        { name: 'Categoría', selector: row => row.categoria, sortable: true, width: '10%', center: true },
        { name: 'Empresa', selector: row => row.empresa, sortable: true, width: '15%', center: true },
        { name: 'Sucursal', selector: row => row.sucursal, sortable: true, width: '15%', center: true },
        {
            name: 'Acciones',
            cell: row => (
                <div className="text-center">
                    <Button variant="outline-info" size="sm" onClick={() => handleEdit(row.id)}>
                        <i className="bi bi-pencil-square"></i>
                    </Button>{' '}
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '20%',
            center: true,
        },
    ];
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#343a40', // color dark
                color: 'white',
                fontWeight: 'bold',
                padding: '0.4rem',
            },
        },
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Usuarios" />
            {
                editing ?
                <FormUser title="Registrar nuevo usuario" user={user} showModal={showModal} setShowModal={setShowModal} editing={editing} setReloadDt={setReloadDt} empresas={empresas} sucursales={sucursales} />
                :
                <FormUser title="Registrar nuevo usuario" showModal={showModal} setShowModal={setShowModal} editing={editing} setReloadDt={setReloadDt} empresas={empresas} sucursales={sucursales} />
            }
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Button variant='outline-success' size='sm' onClick={() => {
                        setShowModal(true);
                        setEditing(false);
                    }}>
                        <i className="bi bi-plus-circle"></i> Nuevo usuario
                    </Button>

                    <input
                        type="text"
                        className="form-control form-control-sm w-25"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Card.Header>

                <Card.Body>
                    <DataTable
                        columns={columns}
                        data={users}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                        responsive
                        highlightOnHover
                        customStyles={customStyles}
                    />
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
