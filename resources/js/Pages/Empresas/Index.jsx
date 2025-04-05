import { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import Swal from 'sweetalert2';

function Index({ auth, empresas, paginacion }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [empresaId, setEmpresaId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [nit, setNit] = useState("");
    const [nrc, setNrc] = useState("");
    const [giro, setGiro] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const openModal = () => {
        setShowModal(true);
        setEditMode(false);
        setEmpresaId(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setNombre("");
        setNit("");
        setNrc("");
        setGiro("");
        setDireccion("");
        setTelefono("");
        setEmpresaId(null);
        setError("");
        setSuccessMessage("");
    };

    const handleEdit = (empresa) => {
        setEditMode(true);
        setEmpresaId(empresa.id);
        setNombre(empresa.nombre);
        setNit(empresa.nit);
        setNrc(empresa.nrc);
        setGiro(empresa.giro);
        setDireccion(empresa.direccion);
        setTelefono(empresa.telefono);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/empresas/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire("¡Eliminado!", data.success, "success").then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire("Error", data.error || "No se pudo eliminar", "error");
                }
            } catch (error) {
                Swal.fire("Error", "Error al eliminar empresa", "error");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editMode ? `/empresas/${empresaId}` : '/storeEmpresa';
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ nombre, nit, nrc, giro, direccion, telefono })
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire("Éxito", editMode ? "Empresa actualizada" : "Empresa agregada", "success")
                    .then(() => window.location.reload());
                closeModal();
            } else {
                setError(data.errors || {});
            }

        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al guardar.");
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Empresas" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div className="col-sm-6 col-md-4">
                        <div className="input-group">
                            <input type="text" placeholder="Buscar ..." className="form-control" />
                            <button className="btn btn-outline-primary"><i className="bi bi-search"></i></button>
                        </div>
                    </div>
                    <button className="btn btn-outline-success" onClick={openModal}>
                        <i className="bi bi-plus-circle"></i>
                    </button>
                </div>

                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th><th>Nombre</th><th>NIT</th><th>NRC</th><th>Giro</th><th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empresas.map((empresa) => (
                                <tr key={empresa.id}>
                                    <td>{empresa.id}</td>
                                    <td>{empresa.nombre}</td>
                                    <td>{empresa.nit}</td>
                                    <td>{empresa.nrc}</td>
                                    <td>{empresa.giro}</td>
                                    <td>
                                        <button title="Editar" className="btn btn-success btn-sm me-1"
                                            onClick={() => handleEdit(empresa)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button title="Eliminar" className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(empresa.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal fade show"
                    tabIndex="-1"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1040
                    }}
                    onClick={closeModal}
                >
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar Empresa</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input type="text" className="form-control" id="nombre" value={nombre}
                                            onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la empresa" />
                                        {error?.nombre && <div className="text-danger">{error.nombre}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nit" className="form-label">NIT</label>
                                        <input type="text" className="form-control" id="nit" value={nit}
                                            onChange={(e) => setNit(e.target.value)} placeholder="NIT de la empresa" />
                                        {error?.nit && <div className="text-danger">{error.nit}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nrc" className="form-label">NRC</label>
                                        <input type="text" className="form-control" id="nrc" value={nrc}
                                            onChange={(e) => setNrc(e.target.value)} placeholder="NRC de la empresa" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="giro" className="form-label">Giro</label>
                                        <input type="text" className="form-control" id="giro" value={giro}
                                            onChange={(e) => setGiro(e.target.value)} placeholder="Giro de la empresa" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="direccion" className="form-label">Dirección</label>
                                        <input type="text" className="form-control" id="direccion" value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección de la empresa" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                                        <input type="text" className="form-control" id="telefono" value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono de la empresa" />
                                    </div>

                                    {successMessage && <div className="text-success">{successMessage}</div>}

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

export default Index;
