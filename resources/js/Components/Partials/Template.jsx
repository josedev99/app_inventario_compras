function Template({sidebar,navbar, infoPage, contentPage}) {
    return (
        <div className="wrapper">
            {/* Sidebar */}
            {sidebar}
            {/* End Sidebar */}
            <div className="main-panel">
                <div className="main-header">
                    <div className="main-header-logo">
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
                    {/* Navbar Header */}
                    {navbar}
                    {/* End Navbar */}
                </div>
                <div className="container">
                    <div className="page-inner">
                        {infoPage}
                        {contentPage}
                    </div>
                </div>
                <footer className="footer">
                    <div className="container-fluid d-flex justify-content-between">
                        <nav className="pull-left">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="http://www.themekita.com">
                                        ThemeKita
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        {" "}
                                        Help{" "}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        {" "}
                                        Licenses{" "}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <div className="copyright">
                            2024, made with <i className="fa fa-heart heart text-danger" /> by
                            <a href="http://www.themekita.com">ThemeKita</a>
                        </div>
                        <div>
                            Distributed by
                            <a target="_blank" href="https://themewagon.com/">
                                ThemeWagon
                            </a>
                            .
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Template;