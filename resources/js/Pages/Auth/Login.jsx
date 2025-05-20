import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />
            <section className="min-vh-100 d-flex align-items-center justify-content-center bg-light bg-gradient" style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-5">
                            <div className="card shadow-lg border-0 rounded-4 p-4">
                                <div className="text-center mb-4">
                                    <img src="/assets/img/kaiadmin/grupo.png" alt="Logo" width="250" />
                                </div>

                                {status && (
                                    <div className="alert alert-success text-center py-2">{status}</div>
                                )}

                                <h4 className="text-center mb-3 fw-bold text-primary">Bienvenido de nuevo</h4>
                                <p className="text-center text-muted mb-4">Inicia sesión para continuar</p>

                                <form onSubmit={submit}>
                                    <div className="mb-3">
                                        <InputLabel htmlFor="email" value="Correo electrónico" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="form-control form-control-lg"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div className="mb-3">
                                        <InputLabel htmlFor="password" value="Contraseña" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="form-control form-control-lg"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="d-flex align-items-center mb-0">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            <span className="ms-2 text-sm text-muted">Recordarme</span>
                                        </label>
                                    </div>

                                    <div className="d-grid mt-4">
                                        <PrimaryButton
                                            className="btn btn-primary btn-lg rounded-pill shadow-sm"
                                            disabled={processing}
                                        >
                                            Iniciar sesión
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                            <p className="text-center text-muted mt-4 small">
                                &copy; {new Date().getFullYear()} GrupoGuerrero. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
