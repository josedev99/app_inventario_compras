import React from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function FormCategoria({ title, showModal, setShowModal }) {
    const { data, setData, reset, processing } = useForm({
        nombre: '',
        descripcion: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post(route('categoria.storeCategoria'), data)
            .then((response) => {
                if (response.data.status && response.data.status.toLowerCase() === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: response.data.message,
                        confirmButtonText: 'Aceptar'
                    });
                    reset();
                    setShowModal(false);
                    if (typeof onCategoriaCreated === "function") {
                        onCategoriaCreated(); 
                    }
                } else {
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Ocurrió un problema inesperado.',
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
                        break;
                    }
                } else {
                    Swal.fire({
                        title: '¡Error inesperado!',
                        text: 'No se pudo procesar la solicitud.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
    };
    
    return (
        <Modal
            size="lg"
            show={showModal}
            backdrop="static"
            keyboard={false}
            onHide={() => setShowModal(false)}
            aria-labelledby="modal-categoria"
            className='m-0'
        >
            <Modal.Header closeButton className='px-2 py-1'>
                <Modal.Title id="modal-categoria" style={{ fontSize: '16px' }}>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-1'>
                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Nombre de la categoria"
                        />
                        {/* Mostrar error si existe */}
                        {data.errors?.nombre && <div className="text-danger">{data.errors.nombre}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">Descripcion</label>
                        <textarea
                            className="form-control"
                            id="descripcion"
                            rows="3"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Descripcion de la categoria"
                        ></textarea>
                        {/* Mostrar error si existe */}
                        {data.errors?.descripcion && <div className="text-danger">{data.errors.descripcion}</div>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
