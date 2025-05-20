import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';

export default function FormSldModal({ title, showModal, setShowModal, setReloadDt, dataProducto = [] }) {
    // Hook useForm para manejar el formulario
    const { data, setData, processing, reset } = useForm({
        codigo_oc: '',
        cantidad: 1,
        producto_id: null,
        nombre: '',
        observaciones: ''
    });

    // Estado para lista de productos (select)
    const [productos, setProductos] = useState([]);

    // Estado para productos agregados a la lista
    const [productIngInv, setProductIngInv] = useState([]);

    // Cargar productos disponibles para el select cuando dataProducto cambie
    useEffect(() => {
        setProductos(dataProducto);
    }, [dataProducto]);

    // Función para manejar el submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (productIngInv.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay productos agregados',
            });
            return;
        }

        const formData = new FormData();
        formData.append('codigo_oc', data.codigo_oc);
        formData.append('productos', JSON.stringify(productIngInv));

        axios.post(route('inv.saveSalida'), formData)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message,
                });
                setProductIngInv([]);
                setReloadDt(true);
                setShowModal(false);
                reset({
                    codigo_oc: '',
                    cantidad: 1,
                    producto_id: null,
                    nombre: '',
                    observaciones: ''
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al guardar los productos en el inventario.',
                });
            });
    };

    // Función para agregar producto a la lista
    const handleAddProduct = () => {
        if (!data.producto_id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Seleccione un producto',
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        if (!data.cantidad || data.cantidad <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ingrese una cantidad válida',
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        const productoSeleccionado = productos.find(p => p.id === data.producto_id);

        if (!productoSeleccionado) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Producto no encontrado',
            });
            return;
        }

        // Ver si ya existe el producto en la lista para sumar cantidades
        const indexExistente = productIngInv.findIndex(p => p.id === data.producto_id);

        if (indexExistente !== -1) {
            const productosActualizados = [...productIngInv];
            productosActualizados[indexExistente] = {
                ...productosActualizados[indexExistente],
                cantidad: productosActualizados[indexExistente].cantidad + Number(data.cantidad),
                nombre: data.nombre || productosActualizados[indexExistente].nombre || '',
                observaciones: data.observaciones || productosActualizados[indexExistente].observaciones || ''
            };
            setProductIngInv(productosActualizados);
        } else {
            const nuevoProducto = {
                id: data.producto_id,
                codigo: productoSeleccionado.codigo,
                descripcion: productoSeleccionado.descripcion,
                cantidad: Number(data.cantidad),
                nombre: data.nombre || '',
                observaciones: data.observaciones || ''
            };
            setProductIngInv([...productIngInv, nuevoProducto]);
        }

        // Limpiar campos específicos para agregar producto
        setData('producto_id', null);
        setData('cantidad', 1);
        setData('nombre', '');
        setData('observaciones', '');
    };

    return (
        <Modal
            size="xl"
            show={showModal}
            backdrop="static"
            keyboard={false}
            onHide={() => setShowModal(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            className='m-0'
        >
            <Modal.Header closeButton className='px-2 py-1'>
                <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: '16px' }}>
                    {title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-1'>
                <Form onSubmit={handleSubmit}>
                    <div className="card m-0 p-2 shadow-lg">
                        <div className="card-header p-1 d-flex justify-content-start align-items-end">
                            <div className="col-sm-12 col-md-12">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                id="nombre"
                                                className="form-control"
                                                value={data.nombre}
                                                onChange={e => setData('nombre', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Observaciones</label>
                                            <textarea
                                                name="observaciones"
                                                id="observaciones"
                                                className="form-control"
                                                rows={1}
                                                value={data.observaciones}
                                                onChange={e => setData('observaciones', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-1">
                            <div className="row">
                                <div className="col-sm-12 col-md-8">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="categoria">Descripción del producto</label>
                                        <Select
                                            value={data.producto_id ? {
                                                value: data.producto_id,
                                                label: productos.find(p => p.id === data.producto_id)?.descripcion || ''
                                            } : null}
                                            onChange={selected => setData('producto_id', selected ? selected.value : null)}
                                            options={productos.map(producto => ({
                                                value: producto.id,
                                                label: producto.descripcion
                                            }))}
                                            className="basic-single"
                                            classNamePrefix="Seleccionar"
                                            isClearable
                                            isSearchable
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-4">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="costo_unit">Cantidad</label>
                                        <div className="d-flex align-items-center gap-4">
                                            <input
                                                type="number"
                                                step={1}
                                                min={1}
                                                max={10000}
                                                className='form-control'
                                                value={data.cantidad}
                                                onChange={e => setData('cantidad', e.target.value)}
                                            />
                                            <button
                                                type='button'
                                                title='Agregar producto a la lista'
                                                onClick={handleAddProduct}
                                                className='btn btn-outline-success btn-sm'
                                                style={{ height: '38px' }}
                                            >
                                                <i className="bi bi-plus-circle" style={{ fontSize: '16px' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-1">
                            <div className="table-responsive">
                                <table className='table-custom table-hover' style={{ fontSize: '12px', width: '100%' }}>
                                    <thead style={{ backgroundColor: '#212529', color: '#fff' }}>
                                        <tr>
                                            <th className='p-1 text-center'>#</th>
                                            <th className='p-1 text-center'>Código</th>
                                            <th className='p-1 text-center'>Descripción</th>
                                            <th className='p-1 text-center'>Cantidad</th>
                                            <th className='p-1 text-center'>Observaciones</th>
                                            <th className='p-1 text-center'>Nombre</th>
                                            <th className='p-1 text-center'>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productIngInv.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className='text-center'>No hay productos agregados</td>
                                            </tr>
                                        ) : (
                                            productIngInv.map((producto, index) => (
                                                <tr key={index}>
                                                    <td className='p-1 text-center'>{index + 1}</td>
                                                    <td className='p-1 text-center'>{producto.codigo}</td>
                                                    <td className='p-1 text-center'>{producto.descripcion}</td>
                                                    <td className='p-1 text-center'>{producto.cantidad}</td>
                                                    <td className='p-1 text-center'>{producto.observaciones}</td>
                                                    <td className='p-1 text-center'>{producto.nombre}</td>
                                                    <td className='p-1 text-center'>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => {
                                                                const filtered = productIngInv.filter((_, i) => i !== index);
                                                                setProductIngInv(filtered);
                                                            }}
                                                        >
                                                            <i className="bi bi-trash" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card-footer p-1 text-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
