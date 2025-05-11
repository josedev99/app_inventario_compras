// resources/js/Pages/Empresas/EmpresaList.jsx

function EmpresaList({ empresas, onEdit, onDelete, onShowModal, onShowSucursalModal, canEdit, canDelete, canSucursalcreate }) {
    return (
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
                            {canEdit && (
                                <button className="btn btn-success btn-sm me-1" onClick={() => onEdit(empresa)}>
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                            )}

                            {canDelete && (
                                <button className="btn btn-danger btn-sm me-1" onClick={() => onDelete(empresa.id)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}

                            {canSucursalcreate && (
                                <button className="btn btn-primary btn-sm me-3" onClick={() => onShowSucursalModal(empresa)}>
                                    <i className="bi bi-building"></i> Crear Sucursal
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EmpresaList;
