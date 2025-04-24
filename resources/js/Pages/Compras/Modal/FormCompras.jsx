import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';

export default function FormCompras({
    title, showModal, setShowModal, compra = {},
    proveedores, empresas, sucursales, onCompraCreated
}) {
    const { data, setData, reset, processing } = useForm({
        fecha_compra: compra?.fecha_compra || '',
        proveedor_id: compra?.proveedor_id || '',
        empresa_id: compra?.empresa_id || '',
        sucursal_id: compra?.sucursal_id || '',
        estado: compra?.estado || 'PENDIENTE',
        codigo: compra?.codigo || ''
    });

    const formatDatetimeLocal = (fecha) => {
        if (!fecha) return '';
        return fecha.replace(' ', 'T').slice(0, 16);
    };

    useEffect(() => {
        if (compra && Object.keys(compra).length > 0) {
            const nuevoData = {
                fecha_compra: formatDatetimeLocal(compra.fecha_compra),
                proveedor_id: compra.proveedor_id || '',
                empresa_id: compra.empresa_id || '',
                sucursal_id: compra.sucursal_id || '',
                estado: compra.estado || 'PENDIENTE',
                codigo: compra.codigo || ''
            };

            /* Solo actualizar si los datos han cambiado */
            setData(nuevoData);
        }
    }, [compra, setData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('compras.storeCompra'), data);
            /* Manejo de respuesta exitosa */
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message || 'La compra se ha creado correctamente.',
                    confirmButtonText: 'Aceptar'
                });
                reset();
                setShowModal(false);
                if (onCompraCreated) onCompraCreated();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: response.data.message || 'No se pudo procesar la solicitud.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (err) {
            console.error('Error:', err);
            /* Aquí puedes manejar el error con más detalles, por ejemplo */
            if (err.response) {
                console.error('Error de respuesta:', err.response.data);
            }
            Swal.fire({
                title: '¡Error inesperado!',
                text: 'No se pudo procesar la solicitud.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };


    /* Asegurarse de que el array sea válido */
    const safeArray = (array) => Array.isArray(array) ? array : [];

    /* Función para obtener la opción seleccionada de un array de opciones (para Select) */
    const getSelectedOption = (array, id) => {
        return array.find(item => item.id === id);
    };

    return (
        <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <label>Fecha de Compra</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={data.fecha_compra}
                                onChange={(e) => setData('fecha_compra', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label>Proveedor</label>
                            <Select
                                value={getSelectedOption(safeArray(proveedores), data.proveedor_id) ? {
                                    value: data.proveedor_id,
                                    label: getSelectedOption(safeArray(proveedores), data.proveedor_id).nombre
                                } : null}
                                onChange={(option) => setData('proveedor_id', option ? option.value : '')}
                                options={safeArray(proveedores).map(p => ({ value: p.id, label: p.nombre }))}
                                isClearable
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label>Empresa</label>
                            <Select
                                value={getSelectedOption(safeArray(empresas), data.empresa_id) ? {
                                    value: data.empresa_id,
                                    label: getSelectedOption(safeArray(empresas), data.empresa_id).nombre
                                } : null}
                                onChange={(option) => setData('empresa_id', option ? option.value : '')}
                                options={safeArray(empresas).map(e => ({ value: e.id, label: e.nombre }))}
                                isClearable
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label>Sucursal</label>
                            <Select
                                value={getSelectedOption(safeArray(sucursales), data.sucursal_id) ? {
                                    value: data.sucursal_id,
                                    label: getSelectedOption(safeArray(sucursales), data.sucursal_id).nombre
                                } : null}
                                onChange={(option) => setData('sucursal_id', option ? option.value : '')}
                                options={safeArray(sucursales).map(s => ({ value: s.id, label: s.nombre }))}
                                isClearable
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label>Estado</label>
                            <select
                                className="form-control"
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                            >
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="PAGADO">PAGADO</option>
                                <option value="CANCELADO">CANCELADO</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-end mt-3">
                        <button type="submit" disabled={processing} className="btn btn-outline-success btn-sm">
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
