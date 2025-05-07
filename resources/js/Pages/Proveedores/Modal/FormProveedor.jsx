import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function FormProveedor({
    title,
    showModal,
    setShowModal,
    onProveedorCreated,
    editMode = false,
    proveedorToEdit = null,
    onClose
}) {
    const { data, setData, reset, processing } = useForm({
        nombre: ''
    });

    useEffect(() => {
        if (editMode && proveedorToEdit) {
            setData({
                nombre: proveedorToEdit.nombre || ''
            });
        } else {
            reset(); 
        }
    }, [editMode, proveedorToEdit, showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = editMode
            ? route('proveedor.updateProveedor', proveedorToEdit.id)
            : route('proveedor.store');

        axios.post(url, data)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message || 'Operación realizada con éxito.',
                    confirmButtonText: 'Aceptar'
                });
                reset();
                setShowModal(false);
                onProveedorCreated();
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
            aria-labelledby="modal-proveedor"
            className='m-0'
        >
            <Modal.Header closeButton className='px-2 py-1'>
                <Modal.Title id="modal-proveedor" style={{ fontSize: '16px' }}>
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
                            placeholder="Nombre del proveedor"
                        />
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
