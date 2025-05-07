import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function FormCategoria({
    title,
    showModal,
    setShowModal,
    onCategoriaCreated,
    editMode = false,
    categoriaToEdit = null,
    onClose
}) {
    const { data, setData, reset, processing } = useForm({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        if (editMode && categoriaToEdit) {
            setData({
                nombre: categoriaToEdit.nombre || '',
                descripcion: categoriaToEdit.descripcion || ''
            });
        } else {
            reset();
        }
    }, [editMode, categoriaToEdit, showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const request = editMode
            ? axios.post(route('categorias.updateCategoria', categoriaToEdit.id), data)
            : axios.post(route('categoria.storeCategoria'), data);

        request
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message || 'Operación realizada con éxito.',
                    confirmButtonText: 'Aceptar'
                });
                reset();
                setShowModal(false);
                onCategoriaCreated();
                onClose?.();
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
            onHide={() => {
                setShowModal(false);
                onClose?.();
            }}
            aria-labelledby="modal-categoria"
            className='m-0'
        >
            <Modal.Header closeButton className='px-2 py-1'>
                <Modal.Title id="modal-categoria" style={{ fontSize: '16px' }}>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-1'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Nombre de la categoría"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            id="descripcion"
                            rows="3"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Descripción de la categoría"
                        ></textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            setShowModal(false);
                            onClose?.();
                        }}>Cerrar</button>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Guardando...' : editMode ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
