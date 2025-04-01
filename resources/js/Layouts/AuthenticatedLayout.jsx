import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, sidebar, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

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
                            <a href="/" className="logo">
                                <img
                                    src="/assets/img/kaiadmin/logo_light.svg"
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
                    {header}
                    {/* End Navbar */}
                </div>
                <div className="container">
                    <div className="page-inner">
                        {children}
                    </div>
                </div>
                <footer className="footer">
                    <div className="container-fluid d-flex justify-content-between">
                        <nav className="pull-left">
                            <ul className="nav">
                                <li className="nav-item">
                                    <Link className="nav-link" href="http://www.themekita.com">
                                        ThemeKita
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={(e) => e.preventDefault()}>
                                        Help
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={(e) => e.preventDefault()}>
                                        Licenses
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <div className="copyright">
                            2024, made with <i className="fa fa-heart heart text-danger" /> by
                            <Link href="http://www.themekita.com"> ThemeKita</Link>
                        </div>
                        <div>
                            Distributed by
                            <Link target="_blank" href="https://themewagon.com/">
                                ThemeWagon
                            </Link>
                            .
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}