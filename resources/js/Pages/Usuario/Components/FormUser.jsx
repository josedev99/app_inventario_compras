import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';

export default function FormUser({ title, showModal, setShowModal, user = {}, empresas = [], sucursales = [], roles = [], editing, setReloadDt }) {
    const { data, post, patch, errors, reset, setData, processing } = useForm({
        nombre: user?.nombre || '',
        direccion: user?.direccion || '',
        telefono: user?.telefono || '',
        email: user?.email || '',
        usuario: user?.usuario || '',
        password: user?.password || '',
        categoria: user?.categoria || '',
        empresa_id: user?.empresa_id || '',
        sucursal_id: user?.sucursal_id || '',
        profile: user?.profile || '', // Aseguramos que el perfil se pase correctamente
        status: user?.status || '',
    });

    const [sucursalesEmpresa, setSucursalesEmpresa] = useState([]);

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
                sucursal_id: user.sucursal_id || '',
                profile: user.profile || '', // Aseguramos que el perfil se pase correctamente
                status: user.status || '',
            };

            if (JSON.stringify(data) !== JSON.stringify(nuevoData)) {
                setData(nuevoData);
            }

            // Filtrar sucursales al editar
            if (user.empresa_id) {
                let filtered = sucursales.filter((s) => parseInt(s.empresa_id) === parseInt(user.empresa_id));
                setSucursalesEmpresa(filtered);
            }
        }
    }, [user]);

    const handleEventEmpresa = (empresa_id) => {
        let filtered = sucursales.filter((s) => parseInt(s.empresa_id) === parseInt(empresa_id));
        setSucursalesEmpresa(filtered);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user?.id) {
            // Lógica de actualización aquí
            update(user.id);
            return;
        }

        // Crear nuevo usuario si no existe user.id
        axios.post(route('user.save'), data)
            .then((response) => {
                if (response.data.status) {
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
                        title: '¡Error!',
                        text: response.data.message,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(err => {
                const errors = err.response?.data?.errors; // Asegurarse de que errors esté definido

                if (errors) {
                    for (let [key, error] of Object.entries(errors)) {
                        Swal.fire({
                            title: '¡Error!',
                            text: error[0],
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                        return;
                    }
                } else {
                    Swal.fire({
                        title: '¡Error inesperado!',
                        text: 'Ocurrió un error desconocido. Por favor, intenta nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
    };

    const update = (id) => {
        axios.post(route('user.update', { id }), data)
            .then((response) => {
                if (response.data.status) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualización exitosa',
                        text: response.data.message
                    });
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
            })
            .catch(err => {
                const errors = err.response?.data?.errors;

                if (errors) {
                    for (let [key, error] of Object.entries(errors)) {
                        Swal.fire({
                            title: '¡Error!',
                            text: error[0],
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                        return;
                    }
                } else {
                    Swal.fire({
                        title: '¡Error inesperado!',
                        text: 'Ocurrió un error desconocido. Por favor, intenta nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
    };


    const statusOptions = [
        { value: 'Active', label: 'Activo' },
        { value: 'Locked', label: 'Bloqueado' },
    ];

    return (
        <Modal size="lg" show={showModal} backdrop="static" keyboard={false} onHide={() => setShowModal(false)} aria-labelledby="example-modal-sizes-title-lg" className='m-0'>
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
                                {[{ label: 'Nombre', field: 'nombre', type: 'text' },
                                { label: 'Dirección', field: 'direccion', type: 'text' },
                                { label: 'Teléfono', field: 'telefono', type: 'text' },
                                { label: 'Correo electrónico', field: 'email', type: 'email' },
                                { label: 'Usuario', field: 'usuario', type: 'text' },
                                { label: 'Contraseña', field: 'password', type: 'password' }]
                                    .map(({ label, field, type }, idx) => (
                                        <div className="col-sm-12 col-md-6" key={idx}>
                                            <div className="form-group mb-1 p-1">
                                                <label className='m-0' htmlFor={field}>{label}</label>
                                                <input type={type} className='form-control' value={data[field]} onChange={(e) => setData(field, e.target.value)} />
                                            </div>
                                        </div>
                                    ))}

                                <div className="col-sm-12 col-md-6">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="categoria">Categoría</label>
                                        <Select
                                            value={data.categoria ? { value: data.categoria, label: data.categoria } : null}
                                            onChange={(option) => setData('categoria', option ? option.value : '')}
                                            options={[{ value: 'Bodega', label: 'Bodega' }, { value: 'Compra', label: 'Compra' }, { value: 'Finanza', label: 'Finanza' }]}
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
                                            value={data.empresa_id ? { value: data.empresa_id, label: empresas.find(e => e.id === data.empresa_id)?.nombre } : null}
                                            onChange={(option) => {
                                                setData('empresa_id', option ? option.value : '');
                                                handleEventEmpresa(option?.value);
                                            }}
                                            options={empresas.map(e => ({ value: e.id, label: e.nombre }))}
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
                                            value={data.sucursal_id ? { value: data.sucursal_id, label: sucursalesEmpresa.find(s => s.id === data.sucursal_id)?.nombre } : null}
                                            onChange={(option) => setData('sucursal_id', option ? option.value : '')}
                                            options={sucursalesEmpresa.map(s => ({ value: s.id, label: s.nombre }))}
                                            className="basic-single"
                                            classNamePrefix="Seleccionar"
                                            isClearable
                                            isSearchable
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-6">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="profile">Rol</label>
                                        <Select
                                            value={data.profile ? { value: data.profile, label: roles.find(role => role.name === data.profile)?.name } : null}
                                            onChange={(option) => setData('profile', option ? option.value : '')}
                                            options={roles.map(role => ({ value: role.name, label: role.name }))}
                                            className="basic-single"
                                            classNamePrefix="Seleccionar"
                                            isClearable
                                            isSearchable
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-6">
                                    <div className="form-group mb-1 p-1">
                                        <label className='m-0' htmlFor="status">Estado</label>
                                        <Select
                                            value={statusOptions.find(option => option.value === data.status) || null}
                                            onChange={(option) => setData('status', option ? option.value : '')}
                                            className="basic-single"
                                            classNamePrefix="Seleccionar"
                                            isClearable
                                            isSearchable
                                            options={statusOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end p-1">
                            <button type="submit" disabled={processing} className="btn btn-outline-success btn-sm">
                                {processing ? 'Enviando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
