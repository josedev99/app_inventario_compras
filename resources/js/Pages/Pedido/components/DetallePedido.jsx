import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useEffect } from 'react';
import "./formPedido.css";

export default function DetallePedido({ title, showModalDet, setShowModalDet, productosPedido = [] }) {
    return (
        <>
            <Modal
                size="lg"
                show={showModalDet}
                backdrop="static"
                keyboard={false}
                onHide={() => setShowModalDet(false)}
                aria-labelledby="example-modal-sizes-title-lg" className='m-0'>
                <Modal.Header closeButton className='px-2 py-1'>
                    <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: '16px' }}>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-1'>
                    <div className="card m-0 p-2 shadow-lg">
                        <div className="card-body p-1">
                            <div className="table-custom-container">
                                <div className="table-custom-responsive">
                                    <table className="table-custom">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Código</th>
                                                <th>Unidad medida</th>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productosPedido.length > 0 ?
                                                    productosPedido.map((item, index) => (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.codigo}</td>
                                                            <td>{item.Umedida}</td>
                                                            <td>{item.nombre}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                                                        </tr>
                                                    ))
                                                    :
                                                    (
                                                        <tr>
                                                            <td colSpan={5} style={{ textAlign: 'center' }}>Sin productos agregados</td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
