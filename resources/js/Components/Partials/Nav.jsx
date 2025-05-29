import { router, usePage } from '@inertiajs/react';

function Nav() {

    const { auth } = usePage().props;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.nombre || 'User')}&background=0D8ABC&color=fff&size=50`;
    const { compraspendientes } = usePage().props;

    return (
        <>
            {/* Navbar Header */}
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
                <div className="container-fluid">
                    
                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                        <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
                            <a
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                href="#"
                                role="button"
                                aria-expanded="false"
                                aria-haspopup="true"
                            >
                                <i className="bi bi-search" />
                            </a>
                            <ul className="dropdown-menu dropdown-search animated fadeIn">
                                <form className="navbar-left navbar-form nav-search">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Search ..."
                                            className="form-control"
                                        />
                                    </div>
                                </form>
                            </ul>
                        </li>
                        
                        <li className="nav-item topbar-icon dropdown hidden-caret">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="notifDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="bi bi-bell" />
                                {compraspendientes > 0 && (
                                    <span className="notification">{compraspendientes}</span>
                                )}
                            </a>
                            <ul
                                className="dropdown-menu notif-box animated fadeIn"
                                aria-labelledby="notifDropdown"
                            >
                                <li>
                                    <div className="dropdown-title">No disponible - notificaciones</div>
                                </li>
                                <li>
                                    <div className="notif-scroll scrollbar-outer">
                                        <div className="notif-center">
                                            <a href="#">
                                                <div className="notif-icon notif-primary">
                                                    <i className="fa fa-user-plus" />
                                                </div>
                                                <div className="notif-content">
                                                    <span className="block"> Sin notificaciones </span>
                                                    <span className="time"> - </span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    {/* <a className="see-all" href="javascript:void(0);">
                                        See all notifications
                                        <i className="bi bi-arrow-90deg-right" />
                                    </a> */}
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item topbar-icon dropdown hidden-caret">
                            <div className="dropdown-menu quick-actions animated fadeIn">
                                <div className="quick-actions-header">
                                    <span className="title mb-1">Quick Actions</span>
                                    <span className="subtitle op-7">Shortcuts</span>
                                </div>
                                
                            </div>
                        </li>
                        <li className="nav-item topbar-user dropdown hidden-caret">
                            <a
                                className="dropdown-toggle profile-pic"
                                data-bs-toggle="dropdown"
                                href="#"
                                aria-expanded="false"
                            >
                                <div className="avatar-sm">
                                    <img
                                        src={avatarUrl}
                                        alt="..."
                                        className="avatar-img rounded-circle"
                                    />
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-user animated fadeIn">
                                <div className="dropdown-user-scroll scrollbar-outer">
                                    <li>
                                        <div className="user-box">
                                            <div className="avatar-lg">
                                                <img
                                                    src={avatarUrl}
                                                    alt="image profile"
                                                    className="avatar-img rounded"
                                                />
                                            </div>
                                            <div className="u-text">
                                                <h4>{auth?.user?.nombre}</h4>
                                                <p className="text-muted">{auth?.user?.email}</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown-divider" />
                                        <a
                                            href="#"
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.post(route('logout'));
                                            }}
                                        >
                                            Logout
                                        </a>
                                    </li>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}

export default Nav;