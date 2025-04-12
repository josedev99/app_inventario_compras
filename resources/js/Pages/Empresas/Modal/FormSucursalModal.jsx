import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

const FormSucursalModal = ({ show, onClose, onSubmit, sucursalData, sucursalesList = [] }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
        encargado: "",
        bodega: "",
    });

    const [logo, setLogo] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const postData = new FormData();
        postData.append('empresa_id', sucursalData?.id);
        Object.entries(formData).forEach(([key, value]) => postData.append(key, value));
        if (logo) postData.append('logo', logo);
    
        try {
            const response = await fetch("/sucursales", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: postData,
            });
    
            const contentType = response.headers.get("content-type");
            const rawText = await response.text();
            console.log("Respuesta cruda:", rawText); // <-- te permite ver exactamente qué devuelve Laravel
    
            const data = contentType?.includes("application/json") ? JSON.parse(rawText) : {};
    
            if (response.ok) {
                Swal.fire("¡Éxito!", "Sucursal creada correctamente", "success");
                onSubmit();
                handleClose();
            } else {
                setError(data.errors || "Error al guardar sucursal.");
                Swal.fire("Error", data.message || "Hubo un problema al guardar", "error");
            }
    
        } catch (err) {
            console.error("Error:", err);
            setError("Error al crear sucursal.");
            Swal.fire("Error", "Error de red o del servidor", "error");
        }
    };
    

    const handleClose = () => {
        setFormData({
            nombre: "",
            direccion: "",
            telefono: "",
            correo: "",
            encargado: "",
            bodega: "",
        });
        setLogo(null);
        setError("");
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Nueva Sucursal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <label>Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <label>Encargado</label>
                            <input type="text" className="form-control" name="encargado" value={formData.encargado} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <label>Teléfono</label>
                            <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <label>Correo</label>
                            <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleInputChange} />
                        </div>
                        <div className="col-12">
                            <label>Dirección</label>
                            <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                        </div>
                        <div className="col-12">
                            <label>Bodega</label>
                            <input type="text" className="form-control" name="bodega" value={formData.bodega} onChange={handleInputChange} />
                        </div>
                        <div className="col-12">
                            <label>Logo</label>
                            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>
                    <div className="text-end mt-3">
                        <Button variant="secondary" onClick={handleClose} className="me-2">Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </div>
                </form>

                {sucursalData && (
                    <p className="mb-3"><strong>Empresa:</strong> {sucursalData.nombre}</p>
                )}

                <div className="mb-3">
                    <h6>Sucursales existentes</h6>
                    <div className="table-responsive">
                        <table className="table table-sm table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Encargado</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sucursalesList.length > 0 ? (
                                    sucursalesList.map((suc, idx) => (
                                        <tr key={idx}>
                                            <td>{suc.nombre}</td>
                                            <td>{suc.encargado}</td>
                                            <td>{suc.telefono}</td>
                                            <td>{suc.direccion}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No hay sucursales registradas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
            </Modal.Body>
        </Modal>
    );
};

export default FormSucursalModal;
