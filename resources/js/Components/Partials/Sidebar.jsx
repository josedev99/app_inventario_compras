import { Link, usePage } from '@inertiajs/react';

function Sidebar() {

    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    // Función para saber si tiene un permiso
    const can = (perm) => permissions.includes(perm);

    console.log("Permisos usuario:", permissions);
    const { appLogo } = usePage().props;
    const logoUrl = appLogo;
    const { comprasFinanzas } = usePage().props;

    return (
        <>
            {/* Sidebar */}
            <div className="sidebar" data-background-color="dark">
                <div className="sidebar-logo">
                    <div className="logo-header" data-background-color="dark">
                        <Link href={route('home.index')} className="logo">
                            <img
                                src={logoUrl}
                                alt="navbar brand"
                                className="navbar-brand"
                                width={200}
                            />
                        </Link>
                        <div className="nav-toggle">
                            <button className="btn btn-toggle toggle-sidebar">
                                <i className="gg-menu-right" />
                            </button>
                            <button className="btn btn-toggle sidenav-toggler">
                                <i className="gg-menu-left" />
                            </button>
                        </div>
                        <button className="topbar-toggler more">
                            <i className="gg-more-vertical-alt" />
                        </button>
                    </div>
                </div>
                <div className="sidebar-wrapper scrollbar scrollbar-inner">
                    <div className="sidebar-content">
                        <ul className="nav nav-secondary">

                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarHomedash">
                                    <i className="bi bi-house fs-4" style={{ color: '#ced4da' }} />
                                    <p>Inicio</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarHomedash">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('home.index')}>
                                                <span className="sub-item">Dashboard</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            {can('modulo_finanzas') && (
                                <li className="nav-item">
                                    <a data-bs-toggle="collapse" href="#sidebarFinanzas">
                                        <i className="bi bi-coin fs-4" style={{ color: '#ced4da' }} />
                                        <p>Finanzas</p>
                                        <span className="caret" />
                                    </a>
                                    <div className="collapse" id="sidebarFinanzas">
                                        <ul className="nav nav-collapse">
                                            <li>
                                                {can('usuario_view') && (
                                                    <Link href={route('compras.estado')}>
                                                        <span className="sub-item">Ordenes de compra</span>
                                                        {comprasFinanzas > 0 && (
                                                            <span className="badge bg-success rounded-circle d-inline-flex align-items-center justify-content-center ms-2" style={{ width: '20px', height: '20px' }}>
                                                                {comprasFinanzas}
                                                            </span>


                                                        )}
                                                    </Link>
                                                )}
                                            </li>

                                            <li>
                                                {can('proveedor_view') && (
                                                    <Link href={route('proveedores.index')}>
                                                        <span className="sub-item">Proveedores</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('usuario_view') && (
                                                    <Link href={route('user.index')}>
                                                        <span className="sub-item">Usuarios</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('role_view') && (
                                                    <Link href={route('roles.index')}>
                                                        <span className="sub-item">Roles</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('permisos_view') && (
                                                    <Link href={route('permisos.index')}>
                                                        <span className="sub-item">Permisos</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('asignar_view') && (
                                                    <Link href={route('asignar.index')}>
                                                        <span className="sub-item">Asignar</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('empresa_view') && (
                                                    <Link href={route('empresas.index')}>
                                                        <span className="sub-item">Empresas</span>
                                                    </Link>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )}


                            {/* proveeduria */}
                            {can('modulo_proveeduria') && (
                                <li className="nav-item">
                                    <a data-bs-toggle="collapse" href="#sidebarProviders">
                                        <i className="bi bi-inboxes fs-4" style={{ color: '#ced4da' }} />
                                        <p>Proveeduria</p>
                                        <span className="caret" />
                                    </a>
                                    <div className="collapse" id="sidebarProviders">
                                        <ul className="nav nav-collapse">
                                            <li>
                                                {can('compras_view') && (
                                                    <Link href={route('compras.index')}>
                                                        <span className="sub-item">Solicitud de compra</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('productos_view') && (
                                                    <Link href={route('producto.index')}><span className="sub-item">Productos</span></Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('proveedor_view') && (
                                                    <Link href={route('proveedores.index')}>
                                                        <span className="sub-item">Proveedores</span>
                                                    </Link>
                                                )}
                                            </li>
                                            <li>
                                                {can('category_view') && (
                                                    <Link href={route('categorias.index')}>
                                                        <span className="sub-item">Categorías</span>
                                                    </Link>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )}

                            {can('modulo_bodegas') && (
                                <li className="nav-item">
                                    <a data-bs-toggle="collapse" href="#sidebarBodega">
                                        <i className="bi bi-box-seam fs-4" style={{ color: '#ced4da' }} />
                                        <p>Bodega</p>
                                        <span className="caret" />
                                    </a>
                                    <div className="collapse" id="sidebarBodega">
                                        <ul className="nav nav-collapse">
                                            <li>
                                                <Link href={route('pedido.index')}>
                                                    <span className="sub-item">Nuevo pedido</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route('inventario.index')}>
                                                    <span className="sub-item">Inventario</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route('inv.ingreso.index')}>
                                                    <span className="sub-item">Entradas</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route('inv.salidasindex')}>
                                                    <span className="sub-item">Salidas</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/* End Sidebar */}
        </>
    );
}

export default Sidebar;
