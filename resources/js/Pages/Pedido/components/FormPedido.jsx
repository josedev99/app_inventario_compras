import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect } from 'react';
import "./formPedido.css";

export default function FormPedido({ title, showModal, setShowModal, productos = [], setReloadDt }) {
    const { data, reset, setData, processing } = useForm({
        nombre: '',
        cantidad: 1,
        producto_id: 0
    });
    //productos Pedidos
    const [productosPedido, setProductosPedido] = useState([]);
    //Agregar productos
    const handleAddProduct = () => {
        if (data.producto_id) {
            let index = productosPedido.findIndex(p => parseInt(p.id) === parseInt(data.producto_id));
            console.log(index);
            if (index !== -1) {
                const nuevosProductos = [...productosPedido];
                const productoActualizado = { ...nuevosProductos[index] };
                productoActualizado.cantidad = parseInt(productoActualizado.cantidad) + parseInt(data.cantidad);
                nuevosProductos[index] = productoActualizado;
                setProductosPedido(nuevosProductos);
            } else {
                // Agregar nuevo producto
                const nuevoProducto = { ...productos.find(p => parseInt(p.id) === parseInt(data.producto_id)), cantidad: data.cantidad };
                setProductosPedido([...productosPedido, nuevoProducto]);
            }

            data.producto_id = 0;
            data.cantidad = 1;
        }
    }
    const deleteItem = (index) => {
        const newProductos = productosPedido.filter((_, i) => i !== index);
        setProductosPedido(newProductos);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        //validaciones
        if(data.nombre.trim() === ""){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre del pedido es obligatorio.'
            });return;
        }
        if(productosPedido.length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Lista de productos vacio.'
            });return;
        }
        data.productos = JSON.stringify(productosPedido);
        axios.post(route('pedido.save'), data)
        .then((response)=>{
            if(response.data.status === "success"){
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message
                });
                reset();
                setShowModal(false);
                setReloadDt(true);
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message
                });
            }
            console.log(response);
        }).catch((err)=>{
            console.log(err);
        })
    }
    return (
        <>
            <Modal
                size="lg"
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
                            <div className="card-body p-1">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="nombre">Nombre del pedido: </label>
                                            <input type="text" className='form-control' value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-8">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="categoria">Seleccionar producto</label>
                                            <Select
                                                value={data.producto_id ?
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
                                    <div className="col-sm-12 col-md-3">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="costo_unit">Cantidad</label>
                                            <input type="number" step={'1'} min={'1'} max={'10000'} className='form-control' value={data.cantidad} onChange={(e) => setData('cantidad', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-1 d-flex justify-content-start align-items-end">
                                        <button type={'button'} onClick={(e) => handleAddProduct()} className='btn btn-outline-success btn-sm mb-3'><i className="bi bi-plus-circle"></i></button>
                                    </div>
                                    <div className="col-sm-12 col-md-12">
                                        <div className="table-custom-container">
                                            <h2 className="table-custom-title mb-0" style={{ fontSize: '14px', textAlign: 'center' }}>Productos</h2>
                                            <div className="table-custom-responsive">
                                                <table className="table-custom">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Código</th>
                                                            <th>Unidad medida</th>
                                                            <th>Descripción</th>
                                                            <th>Cantidad</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            productosPedido.length > 0 ?
                                                            productosPedido.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td style={{textAlign: 'center'}}>{index + 1}</td>
                                                                    <td style={{textAlign: 'center'}}>{item.codigo}</td>
                                                                    <td>{item.Umedida}</td>
                                                                    <td>{item.descripcion.split(' - ')[1]}</td>
                                                                    <td style={{textAlign: 'center'}}>{item.cantidad}</td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <div className="action-btn" onClick={() => deleteItem(index)} title="Eliminar">
                                                                            <i className="bi bi-trash"></i>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            :
                                                            (
                                                                <tr>
                                                                    <td colSpan={6} style={{textAlign: 'center'}}>Sin productos agregados</td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end p-1">
                                <button type='submit' disabled={processing} className='btn btn-outline-success btn-sm'> <i className="bi bi-floppy"></i> {processing ? 'Enviando...' : 'Guardar'}</button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
