import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Error403.css';

const Error403 = () => {
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    };

    return (
        <div className="full-screen-container">
            <img src="assets/img/kaiadmin/grupo.png" alt="Error 403" className="error-image" />
            <h1>403</h1>
            <p className="message">
                Antes de continuar, consulte con su administrador para obtener acceso al sistema.
            </p>
            <div className="btn-custom">
                <button className="btn btn-primary" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
                <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                    Recargar Página
                </button>
            </div>
        </div>
    );
};

export default Error403;
