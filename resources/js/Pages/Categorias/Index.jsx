import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from "@inertiajs/react";
import Swal from 'sweetalert2';

function Index({ auth, categorias, paginacion }) {
    const [showModal, setShowModal] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setNombre("");
        setDescripcion("");
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch('/storeCategoria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    nombre,
                    descripcion
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.success);
                Swal.fire({
                    title: 'Genial',
                    text: 'Agregaste una nueva categoria',
                    icon: 'success',
                });
                setTimeout(() => {
                    window.location.href = '/categorias';
                }, 2000);
                closeModal();
            } else {
                setError(data.errors);
            }

        } catch (error) {
            setError("Hubo un error al guardar la categoría.");
        }
    };


    return (
        <>
            <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
                <Head title="Categorias" />
                <div className="card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="col-sm-6 col-md-4">
                                <div className="input-group">
                                    <button type="submit" className="btn btn-outline-primary pe-4">
                                        <i className="bi bi-search search-icon" />
                                    </button>
                                    <input type="text" placeholder="Buscar ..." className="form-control" />
                                </div>
                            </div>

                            <div>
                                <button className="btn btn-outline-success" onClick={openModal}>
                                    <i className="bi bi-plus-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripcion</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map((categoria, index) => (
                                        <tr key={categoria.id}>
                                            <td>{categoria.id}</td>
                                            <td>{categoria.nombre}</td>
                                            <td>{categoria.descripcion}</td>
                                            <td>
                                                <button title="Editar categoria" className="btn btn-success btn-sm w-90 mt-mobile">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button title="Deshabilitar categoria" className="btn btn-danger btn-sm w-90 mt-mobile">
                                                    <i className="bi bi-slash-circle-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination mt-4">
                            <ul className="pagination justify-content-center">
                                {/* Página Anterior */}
                                {paginacion.prev_page_url && (
                                    <li className="page-item">
                                        <a
                                            className="page-link border-0 rounded-3 text-white bg-primary hover:bg-dark"
                                            href={paginacion.prev_page_url}
                                        >
                                            <i className="bi bi-chevron-left"></i> Anterior
                                        </a>
                                    </li>
                                )}

                                {/* Páginas */}
                                {[...Array(paginacion.last_page)].map((_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${paginacion.current_page === i + 1 ? 'active' : ''}`}
                                    >
                                        <a
                                            className={`page-link border-0 rounded-3 ${paginacion.current_page === i + 1 ? 'bg-primary text-white' : 'text-muted'}`}
                                            href={paginacion.path + '?page=' + (i + 1)}
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                ))}

                                {/* Página Siguiente */}
                                {paginacion.next_page_url && (
                                    <li className="page-item">
                                        <a
                                            className="page-link border-0 rounded-3 text-white bg-primary hover:bg-dark"
                                            href={paginacion.next_page_url}
                                        >
                                            Siguiente <i className="bi bi-chevron-right"></i>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Modal con Animaciones */}
                {showModal && (
                    <>
                        {/* Fondo Oscuro con Modal */}
                        <div
                            className="modal fade show"
                            tabIndex="-1"
                            style={{
                                display: "block",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                zIndex: 1040
                            }}
                            onClick={closeModal}
                        >
                            <div
                                className="modal-dialog"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Agregar Categoria</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={closeModal}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nombre"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    placeholder="Nombre de la categoria"
                                                />
                                                {error?.nombre && <div className="text-danger">{error.nombre}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                                <textarea
                                                    className="form-control"
                                                    id="descripcion"
                                                    rows="3"
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
                                                    placeholder="Descripcion de la categoria"
                                                ></textarea>
                                                {error?.descripcion && <div className="text-danger">{error.descripcion}</div>}
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
                    </>
                )}
            </AuthenticatedLayout>
        </>
    );
}

export default Index;
