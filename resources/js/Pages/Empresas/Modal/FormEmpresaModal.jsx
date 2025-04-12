// pages/Empresas/Modal/FormEmpresaModal.jsx
import React from "react";

const FormEmpresaModal = ({
    show,
    onClose,
    onSubmit,
    editMode,
    nombre,
    setNombre,
    nit,
    setNit,
    nrc,
    setNrc,
    giro,
    setGiro,
    direccion,
    setDireccion,
    telefono,
    setTelefono,
    error,
    successMessage
}) => {
    if (!show) return null;

    return (
        <div className="modal fade show"
            tabIndex="-1"
            style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1040
            }}
            onClick={onClose}
        >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {editMode ? "Editar Empresa" : "Agregar Empresa"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit}>
                            <div className="container">

                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input type="text" className="form-control" id="nombre" value={nombre}
                                            onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la empresa" />
                                        {error?.nombre && <div className="text-danger">{error.nombre}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="nit" className="form-label">NIT</label>
                                        <input type="text" className="form-control" id="nit" value={nit}
                                            onChange={(e) => setNit(e.target.value)} placeholder="NIT" />
                                        {error?.nit && <div className="text-danger">{error.nit}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="nrc" className="form-label">NRC</label>
                                        <input type="text" className="form-control" id="nrc" value={nrc}
                                            onChange={(e) => setNrc(e.target.value)} placeholder="NRC" />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="giro" className="form-label">Giro</label>
                                        <input type="text" className="form-control" id="giro" value={giro}
                                            onChange={(e) => setGiro(e.target.value)} placeholder="Giro" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label htmlFor="direccion" className="form-label">Dirección</label>
                                        <input type="text" className="form-control" id="direccion" value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                                        <input type="text" className="form-control" id="telefono" value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
                                    </div>
                                </div>

                                {successMessage && <div className="text-success mb-3">{successMessage}</div>}

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEmpresaModal;
