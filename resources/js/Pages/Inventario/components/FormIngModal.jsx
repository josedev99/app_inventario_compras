import { useForm } from '@inertiajs/react';
import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect } from 'react';

export default function FormIngModal({ title, showModal, setShowModal,setReloadDt, productos = [] }) {
    const { data, post, patch, errors, reset, setData, processing } = useForm({
            codigo_oc: '',
            cantidad: 1,
            producto_id: 0
        });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (producto?.id) {
            update(producto.id);
            return;
        }
    }
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
                            <div className="card-header p-1">
                                <div className="col-sm-12 col-md-2">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="codigo">Código OC</label>
                                        <input type="text" className='form-control' value={data.codigo_oc} onChange={(e) => setData('codigo_oc', e.target.value)} />
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
                                    <div className="col-sm-12 col-md-2">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="costo_unit">Cantidad</label>
                                            <input type="number" step={'1'} min={'1'} max={'10000'} className='form-control' value={data.costoUnit} onChange={(e) => setData('costoUnit', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-2 d-flex justify-content-center align-items-center">
                                        <button className='btn btn-outline-success btn-sm'><i class="bi bi-plus-circle"></i></button>
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
                                        <tr>
                                            <td className='p-1 text-center'>1</td>
                                            <td className='p-1 text-center'>123456</td>
                                            <td className='p-1 text-center'>Producto 1</td>
                                            <td className='p-1 text-center'>10</td>
                                            <td className='p-1 text-center'>
                                                <button className='btn btn-outline-danger btn-sm'><i class="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer d-flex justify-content-end p-1">
                                <button type='submit' disabled={processing} className='btn btn-outline-success btn-sm'> {processing ? 'Enviando...' : 'Guardar'}</button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
