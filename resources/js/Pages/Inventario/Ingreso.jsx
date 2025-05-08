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

export default function Ingreso({ auth, productos }) {
    const [movimientoIngreso, setMovimientoIngreso] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reloadDt, setReloadDt] = useState(false);

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

    const handleEdit = id => {
        let productoFind = movimientoIngreso.find((item)=>parseInt(item.id) === parseInt(id));
        setShowModal(true);
    };

    const handleDelete = id => {
        let productFind = movimientoIngreso.find((producto)=> parseInt(producto.id) === parseInt(id))
        Swal.fire({
            title: "¿Estás seguro?",
            text: `Esta acción eliminará el producto: "${productFind.nombre}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              axios.post(route('producto.destroy'), { id })
                .then((response) => {
                  if (response.data.status) {
                    Swal.fire({
                      icon: 'success',
                      title: '¡Producto eliminado!',
                      text: response.data.message,
                      confirmButtonText: 'Aceptar'
                    });
                    setReloadDt(true);
                  } else {
                    Swal.fire({
                      title: '¡Error!',
                      text: response.data.message,
                      icon: 'error',
                      confirmButtonText: 'Aceptar'
                    });
                  }
                })
                .catch((error) => {
                  console.error('Error al intentar eliminar el producto:', error);
                  Swal.fire({
                    title: '¡Error inesperado!',
                    text: 'Ocurrió un problema al intentar eliminar el producto. Por favor, intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  });
                });
            }
          });
    };

    const columns = [
        { name: '#', selector: row => row.id, sortable: true, width: '5%', center: true },
        { name: 'Fecha', selector: row => row.fecha, sortable: true, width: '10%', center: true },
        { name: 'Código', selector: row => row.codigo, sortable: true, width: '10%', center: true },
        { name: 'Descripción', selector: row => row.descripcion, sortable: true, width: '35%', center: true },
        { name: 'Unidad medida', selector: row => row.Umedida, sortable: true, width: '10%', center: true },
        { name: 'Cantidad', selector: row => row.cantidad, sortable: true, width: '10%', center: true },
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
