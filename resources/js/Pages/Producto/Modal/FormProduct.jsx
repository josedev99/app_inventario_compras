import { useForm } from '@inertiajs/react';
import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';

export default function FormProduct({ title, showModal, setShowModal, producto = {}, categorias }) {
    const { data, post, patch, errors, reset, setData, processing } = useForm({
        codigo: producto?.codigo,
        nombre: producto?.nombre,
        uMedida: producto?.uMedida,
        costoUnit: producto?.costoUnit,
        categoria_id: producto?.categoria_id
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (producto?.id) {
            update(producto.id);
            return;
        }

        axios.post(route('producto.save'),data)
        .then((response)=>{
            if(response.data.status){
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: response.data.message
                })
                reset();
                setShowModal(false);
                $(".display").DataTable().ajax.reload(null, false); // Recargar tabla
            }else{
                Swal.fire({
                    title: '¡Error!',
                    text: 'Hubo un problema al procesar la solicitud.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
            console.log(response)
        }).catch(err => {
            let errors = err.response?.data?.errors;
            for (let [key, error] of Object.entries(errors)) {
                console.log(key, error);
                Swal.fire({
                    title: '¡Error!',
                    text: error[0],
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            console.log();
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
                                    <div className="col-sm-12 col-md-4">

                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="codigo">Código</label>
                                            <input type="text" id='codigo' className='form-control' value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-8">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="codigo">Nombre</label>
                                            <input type="text" className='form-control' value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="codigo">Unidad de medida</label>
                                            <input type="text" className='form-control' value={data.uMedida} onChange={(e) => setData('uMedida', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="codigo">Costo unitario</label>
                                            <input type="number" step={'0.01'} min={'0'} max={'10000'} className='form-control' value={data.costoUnit} onChange={(e) => setData('costoUnit', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="categoria">Categoría</label>
                                            <select
                                                className="form-control"
                                                value={data.categoria_id}
                                                onChange={(e) => setData('categoria_id', e.target.value)}>
                                                <option value="">Seleccionar</option>
                                                {categorias.map((categoria) => (
                                                    <option key={categoria.id} value={categoria.id}>
                                                        {categoria.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
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
