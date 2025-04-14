import { useForm } from '@inertiajs/react';
import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect,useState } from 'react';

export default function FormUser({ title, showModal, setShowModal, user = {}, empresas = [], sucursales = [], editing, setReloadDt }) {
    const { data, post, patch, errors, reset, setData, processing } = useForm({
        nombre: user?.nombre,
        direccion: user?.direccion,
        telefono: user?.telefono,
        email: user?.email,
        usuario: user?.usuario,
        password: user?.password,
        categoria: user?.categoria,
        empresa_id: user?.empresa_id,
        sucursal_id: user?.sucursal_id,
    });
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            const nuevoData = {
                nombre: user.nombre || '',
                direccion: user.direccion || '',
                telefono: user.telefono || '',
                email: user.email || '',
                usuario: user.usuario || '',
                password: user.password || '',
                categoria: user.categoria || '',
                empresa_id: user.empresa_id || '',
                sucursal_id: user.sucursal_id || ''
            };
    
            if (JSON.stringify(data) !== JSON.stringify(nuevoData)) {
                setData(nuevoData);
            }
        }
    }, [user]);
    const [sucursalesEmpresa, setSucursalesEmpresa] = useState([]);
    const handleEventEmpresa = (empresa_id) => {
        let filter_sucursales = sucursales.filter((sucursal)=> parseInt(sucursal.empresa_id) === parseInt(empresa_id))
        setSucursalesEmpresa(filter_sucursales);
    }
    const update = (id) => {

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (user?.id) {
            update(user.id);
            return;
        }

        axios.post(route('user.save'), data)
            .then((response) => {
                if (response.data.status) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: response.data.message
                    })
                    reset();
                    setShowModal(false);
                    setReloadDt(true);
                } else {
                    Swal.fire({
                        title: '¡Error!',
                        text: response.data.message,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
                console.log(response)
            }).catch(err => {
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
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="nombre">Nombre</label>
                                            <input type="text" className='form-control' value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="direccion">Dirección</label>
                                            <input type="text" className='form-control' value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="telefono">Teléfono</label>
                                            <input type="text" className='form-control' value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="email">Correo electrónico</label>
                                            <input type="email" className='form-control' value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="usuario">Usuario</label>
                                            <input type="text" className='form-control' value={data.usuario} onChange={(e) => setData('usuario', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="password">Contraseña</label>
                                            <input type="password" className='form-control' value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="empresa_id">Categorias</label>
                                            <Select
                                                value={data.categoria ? { value: data.categoria, label: data.categoria } : null}
                                                onChange={(selectedOption) => setData('categoria', selectedOption ? selectedOption.value : '')} // Asegúrate de actualizar correctamente
                                                options={[
                                                    { value: 'Bodega', label: 'Bodega' },
                                                    { value: 'Compra', label: 'Compra' },
                                                    { value: 'Finanza', label: 'Finanza' },
                                                ]}
                                                className="basic-single"
                                                classNamePrefix="Seleccionar"
                                                isClearable
                                                isSearchable
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="empresa_id">Empresa</label>
                                            <Select
                                                value={data.empresa_id ?
                                                    { value: data.empresa_id, label: empresas.find(empresa => empresa.id === data.empresa_id)?.nombre }
                                                    : null}
                                                onChange={(selectedOption) => {
                                                    setData('empresa_id', selectedOption ? selectedOption.value : '');
                                                    handleEventEmpresa(selectedOption.value)
                                                }} // Actualiza correctamente
                                                options={empresas.map((empresa) => ({
                                                    value: empresa.id,
                                                    label: empresa.nombre,
                                                }))}
                                                className="basic-single"
                                                classNamePrefix="Seleccionar"
                                                isClearable
                                                isSearchable
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group mb-1 p-1">
                                            <label className='m-0' htmlFor="sucursal_id">Sucursal</label>
                                            <Select
                                                value={data.sucursal_id ?
                                                    { value: data.sucursal_id, label: sucursalesEmpresa.find(sucursal => parseInt(sucursal.id) === parseInt(data.sucursal_id))?.nombre }
                                                    : null}
                                                onChange={(selectedOption) => setData('sucursal_id', selectedOption ? selectedOption.value : '')} // Actualiza correctamente
                                                options={sucursalesEmpresa.map((sucursal) => ({
                                                    value: sucursal.id,
                                                    label: sucursal.nombre,
                                                }))}
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
                                <button type='submit' disabled={processing} className='btn btn-outline-success btn-sm'> {processing ? 'Enviando...' : 'Guardar'}</button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
