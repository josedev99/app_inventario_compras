import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart, Line
} from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';

function Home({ auth, categoriasCount, usuariosCount, proveedoresCount, comprasCount, labels, dataCompras, productosLabels, productosData, inventario }) {

    const chartData = labels.map((label, index) => ({
        mes: label,
        compras: dataCompras[index],
    }));


    const productosChartData = productosLabels.map((nombre, index) => ({
        producto: nombre,
        cantidad: productosData[index],
    }));

    const inventarioChartData = inventario.map(item => ({
        producto: item.nombre,
        stock: item.cantidad,
    }));



    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Inicio" />

            <div className="container px-4">
                <div className="page-inner pt-3">
                    {/* Encabezado */}
                    <div className="d-flex align-items-start align-items-md-center flex-column flex-md-row pb-3">
                        <div>
                            <h3 className="fw-bold mb-1">
                                Bienvenido <b style={{ color: '#F3C623' }}>{auth ? auth.nombre : 'Usuario'}</b>
                            </h3>
                            <h6 className="text-muted">Sistema de gestión de inventarios</h6>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="row mb-3">
                        {[
                            { icon: 'bi bi-people', color: 'primary', category: 'Usuarios', value: usuariosCount },
                            { icon: 'bi bi-app-indicator', color: 'info', category: 'Proveedores', value: proveedoresCount },
                            { icon: 'bi bi-bag', color: 'success', category: 'Compras', value: comprasCount },
                            { icon: 'bi bi-box', color: 'secondary', category: 'Categorías', value: categoriasCount },
                        ].map((item, idx) => (
                            <div className="col-sm-6 col-md-3" key={idx}>
                                <div className="card card-stats card-round shadow-sm mb-3">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-icon">
                                                <div className={`icon-big text-center text-${item.color} bubble-shadow-small`}>
                                                    <i className={item.icon}></i>
                                                </div>
                                            </div>
                                            <div className="col col-stats ms-3 ms-sm-0">
                                                <div className="numbers">
                                                    <p className="card-category text-muted">{item.category}</p>
                                                    <h4 className="card-title">{item.value}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gráficos */}
                    <div className="row align-items-start">
                        <div className="col-md-8">
                            <div className="card card-round shadow-sm" style={{ borderRadius: '16px' }}>
                                <div className="card-header border-0 bg-transparent">
                                    <h4 className="card-title fw-semibold mb-0">Compras por mes</h4>
                                </div>
                                <div className="card-body pt-2">
                                    <div style={{ width: '100%', height: 350 }}>
                                        <ResponsiveContainer>
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#F3C623" stopOpacity={0.5} />
                                                        <stop offset="100%" stopColor="#F3C623" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="mes" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area
                                                    type="monotone"
                                                    dataKey="compras"
                                                    stroke="#3b82f6"
                                                    fill="url(#colorCompras)"
                                                    strokeWidth={2.5}
                                                    activeDot={{ r: 6 }}
                                                    dot={{ stroke: '#000', strokeWidth: 1, r: 4, fill: '#facc15' }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lado derecho */}
                        <div className="col-md-4">
                            <div className="card card-round shadow-sm mb-3" style={{ backgroundColor: "#ECFDF5", borderLeft: "6px solid #10B981" }}>
                                <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
                                    <h4 className="card-title mb-0 text-green-900 fw-semibold">Top 5 productos más vendidos</h4>
                                </div>
                                <div className="card-body pb-0">
                                    <div style={{ width: '100%', height: 250 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={productosChartData} layout="vertical" margin={{ left: 40 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="producto" type="category" />
                                                <Tooltip />
                                                <Bar dataKey="cantidad" fill="#10B981" radius={[0, 10, 10, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>


                            <div className="card card-round shadow-sm mb-3">
                                <div className="card-header bg-transparent border-0">
                                    <h4 className="card-title fw-semibold mb-0 text-dark">Productos con inventario más alto</h4>
                                </div>
                                <div className="card-body pt-0" style={{ width: '100%', height: 200 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={inventarioChartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="producto" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="stock"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={{ r: 5, stroke: "#1D4ED8", fill: "#3B82F6", strokeWidth: 2 }}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Home;
