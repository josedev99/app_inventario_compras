import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';
import { Button, Card } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormPedido from './components/FormPedido';
import DetallePedido from './components/DetallePedido';

export default function Index({ auth, dataProductos }) {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [reloadDt, setReloadDt] = useState(false);

    const [pedidos,setPedidos] = useState([]);
    const [showModalDet, setShowModalDet] = useState(false);
    const [productosPedido, setProductosPedido] = useState([]);

    const fetchPedidos = async (page = 1, perPage = 10, search = '') => {
        const start = (page - 1) * perPage;

        try {
            const response = await axios.get(route('pedido.listar'), {
                params: {
                    draw: 1,
                    start: start,
                    length: perPage,
                    'search[value]': search,
                },
            });
            setPedidos(response.data.data);
            setTotalRows(response.data.recordsTotal);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchPedidos();
        setReloadDt(false);
        setProductos(dataProductos);
    }, [reloadDt]);

    const handlePageChange = page => {
        fetchPedidos(page, perPage, searchTerm);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchPedidos(page, newPerPage, searchTerm);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchPedidos(1, perPage, value);
    };

    const showDetallePedido = id => {
        axios.post(route('pedido.obtener'), {id: id})
        .then((response)=>{
            let data = response.data;
            if(data.length > 0){
                setProductosPedido(data);
                setShowModalDet(true);
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    };

    const handleDelete = id => {
        let productFind = productos.find((producto)=> parseInt(producto.id) === parseInt(id))
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
        { name: 'Codigo', selector: row => row.codigo, sortable: true, width: '10%', center: true },
        { name: 'fecha', selector: row => row.fecha, sortable: true, width: '10%', center: true },
        { name: 'Nombre pedido', selector: row => row.nombre, sortable: true, width: '35%', center: true },
        { name: 'Cantidad', selector: row => row.cantidad, sortable: true, width: '10%', center: true },
        { name: 'Estado', selector: row => row.estado, sortable: true, width: '10%', center: true },
        {
            name: 'Acciones',
            cell: row => (
                <div className="text-center">
                    <Button variant="outline-info" size="sm" onClick={() => showDetallePedido(row.id)}>
                        <i className="bi bi-eye"></i>
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
            <Head title="Pedidos" />
            <FormPedido showModal={showModal} setReloadDt={setReloadDt} setShowModal={setShowModal} title={"Nuevo pedido"} productos={productos} />
            <DetallePedido showModalDet={showModalDet} setShowModalDet={setShowModalDet} title={"Detalle del pedido"} productosPedido={productosPedido} />
            <Card>
                <Card.Header className='d-flex justify-content-between align-items-center'>
                    <Button onClick={() => {
                        setShowModal(true);
                        setEditing(false);
                    }} variant='outline-success' size='sm'>
                        <i className="bi bi-plus-circle"></i> Nuevo pedido
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
                        data={pedidos}
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