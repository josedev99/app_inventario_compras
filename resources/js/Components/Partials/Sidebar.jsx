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
                                <a data-bs-toggle="collapse"
                                    href="#dashboard"
                                    className="collapsed"
                                    aria-expanded="false">
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
                                <a href="widgets.html">
                                <i className="bi bi-graph-up-arrow"></i>
                                    <p>Finanzas</p>
                                    <span className="badge badge-success">4</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#base">
                                    <i className="bi bi-bag-check" />
                                    <p>Compras</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="base">
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
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarLayouts">
                                    <i className="bi bi-box2-fill" />
                                    <p>Productos</p>
                                    <span className="caret" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#forms">
                                    <i className="bi bi-ui-checks" />
                                    <p>Inventario</p>
                                    <span className="caret" />
                                </a>
                                <div className="collapse" id="forms">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="forms/forms.html">
                                                <span className="sub-item">Ingresos</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="forms/forms.html">
                                                <span className="sub-item">Salidas</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#tables">
                                    <i class="bi bi-house-add-fill"></i>
                                    <p>Sucursales</p>
                                    <span className="caret" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#charts">
                                    <i class="bi bi-building-fill-check"></i>
                                    <p>Empresas</p>
                                    <span className="caret" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#maps">
                                    <i className="bi bi-people-fill" />
                                    <p>Usuarios</p>
                                    <span className="caret" />
                                </a>
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