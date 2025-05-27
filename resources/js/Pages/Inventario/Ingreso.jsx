import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormIngModal from './components/FormIngModal';
import DetalleMov from './components/DetalleMov';

export default function Ingreso({ auth, productos }) {
    const [movimientoIngreso, setMovimientoIngreso] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reloadDt, setReloadDt] = useState(false);

    const [showModalDet, setShowModalDet] = useState(false);
    const [productosIng, setProductosIng] = useState([]);

    const fetchIngresoInv = async (page = 1, perPage = 10, search = '') => {
        const start = (page - 1) * perPage;

        try {
            const response = await axios.get(route('inventario.listar.entradas'), {
                params: {
                    draw: 1,
                    start: start,
                    length: perPage,
                    'search[value]': search,
                },
            });
            setMovimientoIngreso(response.data.data);
            setTotalRows(response.data.recordsTotal);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchIngresoInv(currentPage, perPage, searchTerm);
        setReloadDt(false);
    }, [reloadDt]);

    const handlePageChange = page => {
        fetchIngresoInv(page, perPage, searchTerm);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchIngresoInv(page, newPerPage, searchTerm);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchIngresoInv(1, perPage, value);
    };

    const showDetalleIng = codigo => {
        axios.post(route('inv.det.ingreso'), { codigo: codigo })
            .then((response) => {
                let data = response.data;
                if (data.length > 0) {
                    setProductosIng(data);
                    setShowModalDet(true);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const showPDF = (codigo) => {
        window.open(route('inv.det.ingreso.pdf', btoa(codigo)), '_blank');
    }

    const columns = [
        { name: '#', selector: (_, index) => movimientoIngreso.length - index, sortable: true, width: '5%', center: true },
        { name: 'Fecha', selector: row => row.fecha, sortable: true, width: '15%', center: true },
        { name: 'Código ingreso', selector: row => row.codigo, sortable: true, width: '15%', center: true },
        { name: 'Cantidad', selector: row => row.cantidad, sortable: true, width: '10%', center: true },
        { name: 'Realizado por', selector: row => row.nombre, sortable: true, width: '35%', center: true },
        {
            name: 'Acciones',
            cell: row => (
                <div className="text-center">
                    <Button title='Detalle del ingreso' variant="outline-info" size="sm" onClick={() => showDetalleIng(row.codigo)}>
                        <i className="bi bi-eye"></i>
                    </Button>{' '}
                    <Button title='Visualizar documento PDF' variant="outline-danger" size="sm" onClick={() => showPDF(row.codigo)}>
                        <i className="bi bi-filetype-pdf"></i>
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
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
            <Head title="Inventario" />
            <FormIngModal title="Ingreso de productoStocks a inventario" setReloadDt={setReloadDt} dataProducto={productos} showModal={showModal} setShowModal={setShowModal} />

            <DetalleMov showModalDet={showModalDet} setShowModalDet={setShowModalDet} title={"Detalle del movimiento"} productosIng={productosIng} />

            <Card>
                <Card.Header className='d-flex justify-content-between align-items-center'>
                    <Button onClick={() => {
                        setShowModal(true);
                    }} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Ingreso
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
                        data={movimientoIngreso}
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
