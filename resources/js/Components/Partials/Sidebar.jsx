import { Link } from '@inertiajs/react';

function Sidebar() {
    return (
        <>
            {/* Sidebar */}
            <div className="sidebar" data-background-color="dark">
                <div className="sidebar-logo">
                    {/* Logo Header */}
                    <div className="logo-header" data-background-color="dark">
                        <a href="index.html" className="logo">
                            <img
                                src="assets/img/kaiadmin/logo_light.svg"
                                alt="navbar brand"
                                className="navbar-brand"
                                height={20}
                            />
                        </a>
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
                    {/* End Logo Header */}
                </div>
                <div className="sidebar-wrapper scrollbar scrollbar-inner">
                    <div className="sidebar-content">
                        <ul className="nav nav-secondary">
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#dashboard" aria-expanded="false">
                                    <i className="bi bi-speedometer fs-4" style={{ color: '#ced4da' }} />
                                    <p>Inicio</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="dashboard">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="../demo1/index.html">
                                                <span className="sub-item">Dashboard 1</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarFinanzas">
                                    <i className="bi bi-coin fs-4" style={{ color: '#ced4da' }} />
                                    <p>Finanzas</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarFinanzas">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('proveedores.index')}>
                                                <span className="sub-item">Proveedores</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={route('compras.index')}>
                                                <span className="sub-item">Compras</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={route('user.index')}>
                                                <span className="sub-item">Usuarios</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={route('roles.index')}>
                                                <span className="sub-item">Roles</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={route('permisos.index')}>
                                                <span className="sub-item">Permisos</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Asignar</span>
                                            </a>
                                        </li>
                                        <li>
                                            <Link href={route('empresas.index')}>
                                                <span className="sub-item">Empresas</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>


                            {/* Proveeduria */}
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarProviders">
                                    <i className="bi bi-inboxes fs-4" style={{ color: '#ced4da' }} />
                                    <p>Proveeduria</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarProviders">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Pedidos</span>
                                            </a>
                                        </li>
                                        <li>
                                            <Link href={route('producto.index')}><span className="sub-item">Productos</span></Link>
                                        </li>
                                        <li>
                                            <Link href={route('proveedores.index')}>
                                                <span className="sub-item">Proveedores</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={route('categorias.index')}>
                                                <span className="sub-item">Categorías</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarBodega">
                                    <i class="bi bi-box-seam fs-4" style={{ color: '#ced4da' }} />
                                    <p>Bodega</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarBodega">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('inventario.index')}>
                                                <span className="sub-item">Inventario</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Entrdas</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Salidas</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Nuevo pedido</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Historial entradas</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Historial salidas</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* End Sidebar */}
        </>
    );
}

export default Sidebar;
