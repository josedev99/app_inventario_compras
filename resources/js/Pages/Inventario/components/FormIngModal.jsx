import { useForm } from '@inertiajs/react';
import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect } from 'react';
import { useState } from 'react';

export default function FormIngModal({ title, showModal, setShowModal,setReloadDt, dataProducto = [] }) {
    const { data, setData, processing } = useForm({
            codigo_oc: '',
            cantidad: 1,
            producto_id: 0
        });
    const [productos, setProductos] = useState([]);
    const [productIngInv, setProductIngInv] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if(productIngInv.length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay productos agregados'
            });
            return;
        }
        const formData = new FormData();
        formData.append('codigo_oc', data.codigo_oc);
        formData.append('productos', JSON.stringify(productIngInv));
        axios.post(route('inventario.saveIngreso'), formData)
        .then((response) => {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: response.data.message
            });
            setProductIngInv([]);
            setReloadDt(true);
            setShowModal(false);
        }).catch((error) => {
            console.error('Error al guardar los productos en el inventario.', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar los productos en el inventario.'
            });
        });
    }
    const handleAddProduct = () => {
        if (data.producto_id === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Seleccione un producto',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        if(data.cantidad === '' || data.cantidad <= 0){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ingrese una cantidad valida',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const productoSeleccionado = productos.find(producto => producto.id === data.producto_id);
        if (!productoSeleccionado) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Producto no encontrado'
            });
            return;
        }
        const productoExistente = productIngInv.find(producto => producto.id === data.producto_id);
        if (productoExistente) {
            const productosActualizados = productIngInv.map(producto => {
                if (producto.id === data.producto_id) {
                    return {
                        ...producto,
                        cantidad: producto.cantidad + data.cantidad
                    };
                }
                return producto;
            });
        
            setProductIngInv(productosActualizados);
        } else {
            // Agregar nuevo producto
            const nuevoProducto = {
                id: data.producto_id,
                codigo: productoSeleccionado.codigo,
                descripcion: productoSeleccionado.descripcion,
                cantidad: data.cantidad
            };
        
            setProductIngInv([...productIngInv, nuevoProducto]);
        }
        // Reiniciar los campos del formulario
        setData({
            codigo_oc: '',
            cantidad: 1,
            producto_id: 0
        });
    }

    const handleEventSearch = () => {
        if (data.codigo_oc === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ingrese un código de OC'
            });
            return;
        }
        //Realizar la busqueda de productos por el codigo de OC
        axios.post(route('producto.search.compra'), {codigo: data.codigo_oc})
            .then((response) => {
                if (response.data.length > 0) {
                    setProductIngInv(response.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se encontraron productos para el código de compra ingresado.'
                    });
                }
            })
            .catch((error) => {
                console.error('Error al buscar productos por codigo de compra.', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al buscar los productos por el código de compra.'
                });
            });
    }
        
    useEffect(()=>{
        setProductos(dataProducto);
    },[]);
    return (
        <>
            <Modal
                size="xl"
                show={showModal}
                backdrop="static"
                keyboard={false}
                onHide={() => setShowModal(false)}
                aria-labelledby="example-modal-sizes-title-lg" className='m-0'>
                <Modal.Header closeButton className='px-2 py-1'>
                    <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: '16px' }}>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-1'>
                    <Form onSubmit={handleSubmit}>
                        <div className="card m-0 p-2 shadow-lg">
                            <div className="card-header p-1 d-flex justify-content-start align-items-end">
                                <div className="col-sm-12 col-md-2">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="codigo">Código OC</label>
                                        <div className="d-flex align-items-center gap-1">
                                            <div className="flex-grow-1">
                                                <input type="text" className='form-control' value={data.codigo_oc} onChange={(e) => setData('codigo_oc', e.target.value)} />
                                            </div>
                                            <button type={'button'} title='Buscar productos por código de compra' onClick={(e)=>handleEventSearch()} className='btn btn-outline-success btn-sm' style={{height: '38px'}}><i className="bi bi-search" style={{fontSize: '16px'}}></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-1">
                                <div className="row">
                                    <div className="col-sm-12 col-md-8">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="categoria">Descripcion del producto</label>
                                            <Select
                                                value= {data.producto_id ?
                                                    { value: data.producto_id, label: productos.find(producto => producto.id === data.producto_id)?.descripcion }
                                                    : null}
                                                onChange={(selectedOption) => setData('producto_id', selectedOption ? selectedOption.value : '')} // Asegúrate de actualizar correctamente
                                                options={productos.map(producto => {
                                                    return {
                                                        value: producto.id,
                                                        label: producto.descripcion
                                                    }
                                                })}
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
                                                <div className="flex-grow-1">
                                                    <input type="number" step={'1'} min={'1'} max={'10000'} className='form-control' value= {data.cantidad} onChange={(e) => setData('cantidad', e.target.value)} />
                                                </div>
                                                <button type={'button'} title='Agregar producto a la lista' onClick={(e)=>handleAddProduct()} className='btn btn-outline-success btn-sm' style={{height: '38px'}}><i className="bi bi-plus-circle" style={{fontSize: '16px'}}></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-1">
                                <table className='table-custom table-hover' style={{ fontSize: '12px', width: '100%' }}>
                                    <thead style={{ backgroundColor: '#212529', color: '#fff' }}>
                                        <tr>
                                            <th className='p-1 text-center'>#</th>
                                            <th className='p-1 text-center'>Codigo</th>
                                            <th className='p-1 text-center'>Descripción</th>
                                            <th className='p-1 text-center'>Cantidad</th>
                                            <th className='p-1 text-center'>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            productIngInv.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className='text-center'>No hay productos agregados</td>
                                                </tr>
                                            )
                                        }
                                        {
                                            productIngInv.map((producto, index) => (
                                                <tr key={index}>
                                                    <td className='p-1 text-center'>{index + 1}</td>
                                                    <td className='p-1 text-center'>{producto.codigo}</td>
                                                    <td className='p-1 text-center'>{producto.descripcion}</td>
                                                    <td className='p-1 text-center'>{producto.cantidad}</td>
                                                    <td className='p-1 text-center'>
                                                        <button type={'button'} title='Remover producto de la lista a ingresar' onClick={() => {
                                                            setProductIngInv(productIngInv.filter((_, i) => i !== index));
                                                        }} className='btn btn-outline-danger btn-sm'><i className="bi bi-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer d-flex justify-content-end p-1">
                                <button type='submit' disabled={processing} className='btn btn-outline-success btn-sm'> {processing ? 'Enviando...' : 'Ingresar'}</button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
