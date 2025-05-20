import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect } from 'react';
import "./formPedido.css";

export default function FormPedido({ title, showModal, setShowModal, pedido = {}, productos = [], setReloadDt, setShowModalProduct, newProductoId = 0, setProductoId, editing, setEditing }) {
    const { data, reset, setData, processing } = useForm({
        id: pedido.id ?? 0,
        nombre: pedido.nombre ?? '',
        cantidad: 1,
        producto_id: 0
    });
    //productos Pedidos
    const [productosPedido, setProductosPedido] = useState([]);
    //Agregar productos
    const handleAddProduct = () => {
        //Validacion para cantidad de productos
        if(data.cantidad === 0 || data.cantidad === ""){
            Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Cantidad no válida.'
            });return;
        }
        if (data.producto_id) {
            let index = productosPedido.findIndex(p => parseInt(p.id) === parseInt(data.producto_id));
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
            setProductoId(0);
            data.cantidad = 1;
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Producto no seleccionado.'
            });
        }
    }

    useEffect(()=>{
        // Solo ejecuta esto si se está editando y hay compra con ID
        if (editing && pedido?.id) {
            const nuevoData = {
                id: pedido.id,
                nombre: pedido.nombre || '',
                cantidad: 1,
                producto_id: 0
            };
    
            // Evita volver a setear el mismo estado
            setData(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(nuevoData)) {
                    return nuevoData;
                }
                return prev;
            });
            setProductosPedido(pedido.detalles ?? []);
        }
    
        // Si NO estamos editando y no hay compra => es nueva compra
        if (!editing && (!pedido || Object.keys(pedido).length === 0)) {
            reset();
            setProductosPedido([]);
        }
    },[pedido?.id, editing, showModal]);

    useEffect(()=>{
        if(newProductoId !== 0){
            data.producto_id = newProductoId;
        }else{
            data.producto_id = 0;
        }
    }, [newProductoId])

    const deleteItem = (index) => {
        const newProductos = productosPedido.filter((_, i) => i !== index);
        setProductosPedido(newProductos);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        //validaciones
        if (data.nombre.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre del pedido es obligatorio.'
            }); return;
        }
        if (productosPedido.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Lista de productos vacio.'
            }); return;
        }
        data.productos = JSON.stringify(productosPedido);
        try{
            let response = null;
            if(data.id !== 0){
                response = await axios.post(route('pedido.update'), data);
            }else{
                response = await axios.post(route('pedido.save'), data);
            }
    
            if (response.data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message
                });
                reset();
                setShowModal(false);
                setReloadDt(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message
                });
            }
        }catch(err){
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error, intente nuvamente.'
            });
        }
    }
    //Editing cantidad item
    const handleCantidadItem = (value,index) => {
        const nuevosProductos = [...productosPedido];
        nuevosProductos[index].cantidad = value;
        setProductosPedido(nuevosProductos);
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
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <Select
                                                        value={data.producto_id ?
                                                            { value: data.producto_id, label: productos.find(producto => producto.id === data.producto_id)?.descripcion }
                                                            : null}
                                                        onChange={(selectedOption) => setData('producto_id', selectedOption ? selectedOption.value : '')}
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
                                                <button onClick={(e) => setShowModalProduct(true)} title='Agregar nuevo producto' className="btn btn-outline-success btn-sm" type="button" style={{height: '38px'}}>
                                                    <i className="bi bi-plus-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="costo_unit">Cantidad</label>
                                            <div className="d-flex align-items-center gap-4">
                                                <div className="flex-grow-1">
                                                    <input type="number" step={'1'} min={'1'} max={'10000'} className='form-control' value={data.cantidad} onChange={(e) => setData('cantidad', e.target.value)} />
                                                </div>
                                                <button type={'button'} onClick={(e) => handleAddProduct()} className='btn btn-outline-success btn-sm' style={{height: '38px'}}><i class="bi bi-cart-plus-fill"></i></button>
                                            </div>
                                        </div>
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
                                                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                                        <td style={{ textAlign: 'center' }}>{item.codigo}</td>
                                                                        <td>{item.Umedida}</td>
                                                                        <td>{item.descripcion.split(' - ')[1]}</td>
                                                                        <td style={{ textAlign: 'center' }}>
                                                                        <input
                                                                            onChange={(e) => handleCantidadItem(e.target.value, index)}
                                                                            value={item.cantidad || ''}
                                                                            className="form-control"
                                                                            type="number"
                                                                            step={0.01}
                                                                            min={1}
                                                                            max={10000000}
                                                                            style={{ width: '120px', height: '34px' }}
                                                                        />
                                                                        </td>
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
                                                                        <td colSpan={6} style={{ textAlign: 'center' }}>Sin productos agregados</td>
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
