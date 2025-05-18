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
import FormProducto from './components/FormProducto';

export default function Index({ auth, categorias }) {

    const permissions = auth.permissions || [];
    const can = (permissionName) => permissions.includes(permissionName);

    const [productos, setProductos] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [reloadDt, setReloadDt] = useState(false);

    const [pedidos, setPedidos] = useState([]);
    const [showModalDet, setShowModalDet] = useState(false);
    const [showModalProduct, setShowModalProduct] = useState(false);
    const [productosPedido, setProductosPedido] = useState([]);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [newProductoId, setProductoId] = useState(0);
    //editing useState
    const [pedido,setPedido] = useState({});

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

            const pedidosAprobados = response.data.data.filter(pedido => pedido.estado === "APROBADO");

            if (pedidosAprobados.length > 0) {
                pedidosAprobados.sort((a, b) => a.id - b.id);
                const ultimoPedidoId = pedidosAprobados[0].id.toString();

                const ultimoPedidoMostrado = localStorage.getItem('ultimoPedidoAprobadoMostrado');

                if (ultimoPedidoId !== ultimoPedidoMostrado) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Pedido aprobado',
                        text: 'Hay pedidos aprobados en la lista.',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        localStorage.setItem('ultimoPedidoAprobadoMostrado', ultimoPedidoId);
                    });
                }
            }

        } catch (error) {
            console.error('Error al cargar los pedidos:', error);
        }
    };

    const fetchProductos = async () => {
        let response = await axios.get(route('pedidos.productos.obtener'));
        setProductos(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        fetchProductos();
        setRefreshProduct(false);
    }, [refreshProduct]);

    useEffect(() => {
        fetchPedidos();
        setReloadDt(false);
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
        axios.post(route('pedido.obtener'), { id: id })
            .then((response) => {
                let data = response.data;
                if (data.length > 0) {
                    setProductosPedido(data);
                    setShowModalDet(true);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const showPDF = (id) => {
        window.open(route('pedido.show.pdf', btoa(id)), '_blank');
    }

    const handleDelete = id => {
        let productFind = productos.find((producto) => parseInt(producto.id) === parseInt(id))
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

    //Function para editar el pedido
    const editPedido = (id) => {
        axios.post(route('pedido.edit'), {id: id})
        .then((response) => {
            setEditing(true);
            setPedido(response.data);
            setShowModal(true);
        }).catch((err) => {
            console.log(err);
        })
    }

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
                    <Button variant="outline-info" title='Editar el pedido' size="sm" onClick={() => editPedido(row.id)}>
                        <i class="bi bi-pencil-square"></i>
                        </Button>{' '}
                    {can('pedido_pdf') && (
                        <Button variant="outline-info" title='Imprimir detalles del pedido' size="sm" onClick={() => showPDF(row.id)}>
                            <i className="bi bi-filetype-pdf"></i>
                        </Button>)}{' '}
                    {can('pedido_details') && (
                        <Button variant="outline-info" size="sm" title='Ver detalle del pedido' onClick={() => showDetallePedido(row.id)}>
                            <i className="bi bi-eye"></i>
                        </Button>)}{' '}
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

            <FormPedido showModal={showModal} setReloadDt={setReloadDt} setShowModal={setShowModal} title={editing ? `Actulizando el pedido: ${pedido?.nombre}` : "Nuevo pedido"} productos={productos} setShowModalProduct={setShowModalProduct} newProductoId={newProductoId} setProductoId={setProductoId} editing={editing} setEditing={setEditing} pedido={pedido} />

            <DetallePedido showModalDet={showModalDet} setShowModalDet={setShowModalDet} title={"Detalle del pedido"} productosPedido={productosPedido} />

            <FormProducto title="Registrar nuevo producto" showModalProduct={showModalProduct} setShowModalProduct={setShowModalProduct} categorias={categorias} setRefreshProduct={setRefreshProduct} setProductoId={setProductoId} />
            <Card>
                <Card.Header className='d-flex justify-content-between align-items-center'>
                    {can('nuevo_pedido') && (
                        <Button onClick={() => {
                            setShowModal(true);
                            setEditing(false);
                            setPedido({})
                        }} variant='outline-success' size='sm'>
                            <i className="bi bi-plus-circle"></i> Nuevo pedido
                        </Button>
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