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
                            <li className="nav-item active">
                                <a data-bs-toggle="collapse" href="#dashboard" aria-expanded="false">
                                    <i className="bi bi-house-check-fill"></i>
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
                                <a data-bs-toggle="collapse" href="#sidebarLayouts">
                                    <i className="bi bi-tags-fill" />
                                    <p>Categorías</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarLayouts">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('categorias.index')}>
                                                <span className="sub-item">Categorías</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarProviders">
                                    <i className="bi bi-shop" />
                                    <p>Proveedores</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarProviders">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Proveedor 1</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarFinances">
                                    <i className="bi bi-graph-up-arrow" />
                                    <p>Finanzas</p>
                                    <span className="badge badge-success">4</span>
                                </a>
                                <div className="collapse" id="sidebarFinances">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Reporte de Finanzas</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarInventarios">
                                    <i className="bi bi-ui-checks" />
                                    <p>Inventarios</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarInventarios">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Ingresos</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Salidas</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarPurchases">
                                    <i className="bi bi-bag-check" />
                                    <p>Compras</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarPurchases">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="components/avatars.html">
                                                <span className="sub-item">Solicitudes de compra</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="components/buttons.html">
                                                <span className="sub-item">Ordenes de compra</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            {/* Productos */}
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarProducts">
                                    <i className="bi bi-box2-fill" />
                                    <p>Productos</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarProducts">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('producto.index')}><span className="sub-item">Gestionar productos</span></Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            {/* Sucursales */}
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarBranches">
                                    <i className="bi bi-house-add-fill" />
                                    <p>Sucursales</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarBranches">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Sucursal 1</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            {/* Empresas */}
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarCompanies">
                                    <i className="bi bi-building-fill-check" />
                                    <p>Empresas</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarCompanies">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('empresas.index')}>
                                                <span className="sub-item">Lista de Empresas</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>


                            {/* Usuarios */}
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarUsers">
                                    <i className="bi bi-people-fill" />
                                    <p>Usuarios</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="sidebarUsers">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <Link href={route('user.index')}>
                                                <span className="sub-item">Gestion de usuarios</span>
                                            </Link>
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
