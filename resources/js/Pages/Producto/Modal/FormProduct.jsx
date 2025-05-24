import { useForm } from '@inertiajs/react';
import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect } from 'react';

export default function FormProduct({ title, showModal, setShowModal, producto = {}, categorias,unidadMedidas, editing,setReloadDt }) {
    const { data, post, patch, errors, reset, setData, processing } = useForm({
        codigo: producto?.codigo,
        nombre: producto?.nombre,
        uMedida: producto?.uMedida,
        costoUnit: producto?.costoUnit,
        categoria_id: producto?.categoria_id
    });
    
    useEffect(() => {
        if (producto && Object.keys(producto).length > 0) {
            const nuevoData = {
                codigo: producto.codigo || '',
                nombre: producto.nombre || '',
                uMedida: producto.uMedida || '',
                costoUnit: producto.costoUnit || '',
                categoria_id: producto.categoria_id || ''
            };
    
            if (JSON.stringify(data) !== JSON.stringify(nuevoData)) {
                setData(nuevoData);
            }
        }
    }, [producto]);

    const update = (id) => {
        data.id = id;
        axios.post(route('producto.update'),data)
        .then((response)=>{
            if(response.data.status){
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message
                })
                reset();
                setShowModal(false);
                setReloadDt(true);
            }else{
                Swal.fire({
                    title: '¡Error!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch((err)=>{
            console.log(err);
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
        })
    }

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
                setReloadDt(true);
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
        })
    }
    //Buscar el codigo del producto por categoria
    const searchCodigoCatById = (categoriaId) => {
        if (categoriaId) {
            axios.post(route('producto.getIncrementCodigo'), { categoria_id: categoriaId })
                .then((response) => {
                    if (response.data.status === 'success') {
                        setData('codigo', response.data.codigo);
                    } else {
                        setData('codigo', '');
                        Swal.fire({
                            title: '¡Error!',
                            text: 'No se pudo obtener el código del producto.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                })
                .catch(err => {
                    setData('codigo', '');
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Hubo un problema al buscar el código del producto.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
        } else {
            setData('codigo', '');
        }
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
                                            <input readOnly type="text" className='form-control' value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-8">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="nombre">Nombre</label>
                                            <input type="text" className='form-control' value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="categoria">Unidad de medida</label>
                                            <Select
                                                value= {data.uMedida ?
                                                    { value: data.uMedida.toUpperCase(), label: unidadMedidas.find(item => item.nombre.toUpperCase() === data.uMedida.toUpperCase())?.nombre.toUpperCase() }
                                                    : null}
                                                onChange={(selectedOption) => setData('uMedida', selectedOption ? selectedOption.value : '')} // Asegúrate de actualizar correctamente
                                                options={unidadMedidas.map(item => {
                                                    return {
                                                        value: item.nombre.toUpperCase(),
                                                        label: item.nombre.toUpperCase()
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
                                            <label className='m-0' htmlFor="costo_unit">Costo unitario</label>
                                            <input type="number" step={'0.01'} min={'0'} max={'10000'} className='form-control' value={data.costoUnit} onChange={(e) => setData('costoUnit', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="categoria">Categoría</label>
                                            <Select
                                                value= {data.categoria_id ?
                                                    { value: data.categoria_id, label: categorias.find(categoria => categoria.id === data.categoria_id)?.nombre }
                                                    : null}
                                                onChange={(selectedOption) => {
                                                    setData('categoria_id', selectedOption ? selectedOption.value : '');
                                                    searchCodigoCatById(selectedOption ? selectedOption.value : '');
                                                }}
                                                options={categorias.map(categoria => {
                                                    return {
                                                        value: categoria.id,
                                                        label: categoria.nombre
                                                    }
                                                })}
                                                className="basic-single"
                                                classNamePrefix="Seleccionar"
                                                isClearable
                                                isSearchable
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end p-1">
                                <button type='submit' disabled={processing} className='btn btn-outline-success btn-sm'> {processing ? 'Enviando...' : editing ? 'Guardar cambios' : 'Guardar'}</button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
