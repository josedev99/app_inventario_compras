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

export default function Index({ auth, productos }) {

    const permissions = auth.permissions || [];
    const can = (permissionName) => permissions.includes(permissionName);

    const [productoStocks, setproductoStocks] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reloadDt, setReloadDt] = useState(false);

    const fetchproductoStocks = async (page = 1, perPage = 10, search = '') => {
        const start = (page - 1) * perPage;

        try {
            const response = await axios.get(route('inventario.listar'), {
                params: {
                    draw: 1,
                    start: start,
                    length: perPage,
                    'search[value]': search,
                },
            });
            setproductoStocks(response.data.data);
            setTotalRows(response.data.recordsTotal);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchproductoStocks(currentPage, perPage, searchTerm);
        setReloadDt(false);
    }, [reloadDt]);

    const handlePageChange = page => {
        fetchproductoStocks(page, perPage, searchTerm);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchproductoStocks(page, newPerPage, searchTerm);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchproductoStocks(1, perPage, value);
    };

    const handleEdit = id => {
        let productoFind = productoStocks.find((item) => parseInt(item.id) === parseInt(id));
        setShowModal(true);
    };

    const handleDelete = id => {
        let productFind = productoStocks.find((producto) => parseInt(producto.id) === parseInt(id))
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

    const generarDocumento = () => {
        Swal.fire({
            title: "¿Deseas generar el PDF?",
            text: "Se generará un archivo con el inventario actual.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, generar PDF",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                window.open(route('inv.stock.pdf'), '_blank');
            }
          });
    }

    const columns = [
        { name: '#', selector: (row, index) => index + 1, sortable: true, width: '5%', center: true },
        { name: 'Código producto', selector: row => row.codigo, sortable: true, width: '20%', center: true },
        { name: 'Descripción', selector: row => row.descripcion, sortable: true, width: '45%', center: true },
        { name: 'Unidad medida', selector: row => row.Umedida, sortable: true, width: '10%', center: true },
        { name: 'Costo', selector: row => `$${parseFloat(row.precio_venta).toFixed(2)}`, sortable: true, width: '10%', center: true },
        { name: 'Stock', selector: row => row.stock, sortable: true, width: '10%', center: true },
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
                    {can('inventarios_create') && (
                    <div>
                        <Button onClick={() => {
                            setShowModal(true);
                        }} variant='outline-success' size='sm'>
                            <i className="bi bi-plus-circle"></i> Ingreso
                        </Button>
                        <Button
                            onClick={()=>generarDocumento()}
                            variant='outline-danger mx-3' size='sm'
                        > <i class="bi bi-filetype-pdf"></i> Inventario</Button>
                    </div>
                    )}
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
                        data={productoStocks}
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
