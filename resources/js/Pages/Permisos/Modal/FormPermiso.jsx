import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function FormPermiso({
    title,
    showModal,
    setShowModal,
    onPermisoCreated,
    editMode = false,
    permisoToEdit = null,
    onClose
}) {
    const { data, setData, reset, processing } = useForm({
        name: ''
    });

    useEffect(() => {
        if (editMode && permisoToEdit) {
            setData({
                name: permisoToEdit.name || '',
            });
        } else {
            reset();
        }
    }, [editMode, permisoToEdit, showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const request = editMode
            ? axios.post(route('permisos.updatePermiso', permisoToEdit.id), data)
            : axios.post(route('permisos.storePermission'), data);

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
                onPermisoCreated?.();
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

    const handleClose = () => {
        setShowModal(false);
        onClose?.();
        reset();
    };

    return (
        <Modal
            size="lg"
            show={showModal}
            backdrop="static"
            keyboard={false}
            onHide={handleClose}
            aria-labelledby="modal-permiso"
            className="m-0"
        >
            <Modal.Header closeButton className="px-2 py-1">
                <Modal.Title id="modal-permiso" style={{ fontSize: '16px' }}>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-1">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="permiso-name" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="role-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nombre del permiso"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cerrar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Guardando...' : editMode ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
