import { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import Swal from 'sweetalert2';
import FormEmpresaModal from "./Modal/FormEmpresaModal";
import FormSucursalModal from "./Modal/FormSucursalModal"; // Importamos el modal de sucursal
import EmpresaList from "./EmpresaList/EmpresaList";


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
    const [sucursalData, setSucursalData] = useState(null);
    const [showSucursalModal, setShowSucursalModal] = useState(false);
    const [listaDeSucursales, setListaDeSucursales] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const openModal = () => {
        setShowModal(true);
        setEditMode(false);
        resetForm();
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const openSucursalModal = (empresa) => {
        setSucursalData(empresa);
        setShowSucursalModal(true); // Abrimos el modal de sucursal
    };

    const closeSucursalModal = () => {
        setShowSucursalModal(false);
        setSucursalData(null); // Limpiamos los datos cuando cerramos el modal
    };

    const resetForm = () => {
        setEmpresaId(null);
        setNombre("");
        setNit("");
        setNrc("");
        setGiro("");
        setDireccion("");
        setTelefono("");
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

        const url = editMode ? `/empresas/${empresaId}` : '/storeEmpresa';
        const method = editMode ? 'PUT' : 'POST';
        const bodyData = {
            nombre,
            nit,
            nrc,
            giro,
            direccion,
            telefono
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(bodyData)
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

    const handleShowSucursalModal = async (empresa) => {
        openSucursalModal(empresa); // Abrimos el modal
        setSucursalData(empresa);   // Guardamos los datos de la empresa seleccionada
    
        try {
            const response = await fetch(`/sucursales?empresa_id=${empresa.id}`);
            const data = await response.json();
            setListaDeSucursales(data);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };
    

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Empresas" />

            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <button className="btn btn-outline-success" onClick={openModal}>
                        <i className="bi bi-plus-circle"> Nueva Empresa</i>
                    </button>
                </div>
                
                <div className="card-body">
                    <EmpresaList
                        empresas={empresas}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onShowSucursalModal={handleShowSucursalModal} // Pasamos la función aquí
                    />

                    {/* Paginación */}
                    {paginacion && paginacion.last_page > 1 && (
                        <div className="d-flex justify-content-between mt-3">
                            <button
                                disabled={paginacion.current_page === 1}
                                onClick={() => window.location.href = paginacion.prev_page_url}
                                className="btn btn-outline-primary"
                            >
                                Anterior
                            </button>
                            <button
                                disabled={paginacion.current_page === paginacion.last_page}
                                onClick={() => window.location.href = paginacion.next_page_url}
                                className="btn btn-outline-primary"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para Empresa */}
            <FormEmpresaModal
                show={showModal}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editMode={editMode}
                nombre={nombre}
                setNombre={setNombre}
                nit={nit}
                setNit={setNit}
                nrc={nrc}
                setNrc={setNrc}
                giro={giro}
                setGiro={setGiro}
                direccion={direccion}
                setDireccion={setDireccion}
                telefono={telefono}
                setTelefono={setTelefono}
                error={error}
                successMessage={successMessage}
            />

            {/* Modal para Sucursal */}
            <FormSucursalModal
                show={showSucursalModal}
                onClose={closeSucursalModal}
                onSubmit={() => {} /* Implementa la lógica para manejar la sucursal */}
                sucursalData={sucursalData}
            />
        </AuthenticatedLayout>
    );
}

export default Index;
