import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from '@/Components/Partials/Nav';
import Sidebar from '@/Components/Partials/Sidebar';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Card, Button, Spinner, FormControl } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

export default function Index({ auth }) {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permissionsCache, setPermissionsCache] = useState({}); // Cache de permisos
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            if (permissionsCache[selectedRole.value]) {
                setPermissions(permissionsCache[selectedRole.value]);
            } else {
                fetchPermissions(selectedRole.value);
            }
        }
    }, [selectedRole, permissionsCache]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(route('roles.getRoles'));
            const data = response.data.data.map(role => ({
                value: role.id,
                label: role.name
            }));
            setRoles(data);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    };

    const fetchPermissions = async (roleId) => {
        setLoading(true);
        try {
            const response = await axios.get(route('asignar.getDataIndexAsignar'), {
                params: { role_id: roleId }
            });

            const permissionsData = response.data.data.map(p => ({
                ...p,
                assigned: !!p.assigned // Asignar estado por defecto
            }));

            setPermissionsCache(prev => ({
                ...prev,
                [roleId]: permissionsData
            }));

            setPermissions(permissionsData);
            setTotalRows(response.data.total); // Para la paginación
        } catch (error) {
            console.error('Error al obtener permisos:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = async (permissionId, assign) => {
        if (!selectedRole) return;

        setPermissions(prev =>
            prev.map(p =>
                p.id === permissionId ? { ...p, assigned: assign } : p
            )
        );

        try {
            await axios.post(route('asignar.storeAsignarPermisosRoles'), {
                role_id: selectedRole.value,
                permission_id: permissionId,
                assign: assign
            });

            Swal.fire({
                title: 'Éxito',
                text: assign ? 'Permiso asignado' : 'Permiso revocado',
                icon: assign ? 'success' : 'warning'
            });
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Ocurrió un error', 'error');
            setPermissions(prev =>
                prev.map(p =>
                    p.id === permissionId ? { ...p, assigned: !assign } : p
                )
            );
        }
    };

    const asignarTodo = async () => {
        if (!selectedRole) return;

        try {
            await axios.post(route('asignar.AsignarTodo'), {
                role_id: selectedRole.value
            });

            Swal.fire('Éxito', 'Todos los permisos fueron asignados.', 'success');
            fetchPermissions(selectedRole.value);
        } catch {
            Swal.fire('Error', 'Hubo un error al asignar todos los permisos.', 'error');
        }
    };

    const revocarTodo = async () => {
        if (!selectedRole) return;

        try {
            await axios.post(route('asignar.RevocarTodo'), {
                role_id: selectedRole.value
            });

            Swal.fire('Éxito', 'Todos los permisos fueron revocados.', 'success');
            fetchPermissions(selectedRole.value);
        } catch {
            Swal.fire('Error', 'Hubo un error al revocar todos los permisos.', 'error');
        }
    };

    const filteredPermissions = permissions.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#343a40',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.4rem',
            },
        },
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Permiso',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Asignado',
            cell: row => (
                <input
                    type="checkbox"
                    checked={row.assigned}
                    onChange={e => togglePermission(row.id, e.target.checked)}
                />
            ),
            sortable: false,
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Asignar Permisos" />
            <Card className="mt-4">
                <Card.Header>
                    <h4 className="m-0">Asignar permisos a roles</h4>
                </Card.Header>
                <Card.Body>
                    <div className="mb-3 row">
                        <div className="col-md-4">
                            <Select
                                options={roles}
                                value={selectedRole}
                                onChange={setSelectedRole}
                                placeholder="Selecciona un rol"
                            />
                        </div>
                        <div className="col-md-4">
                            <Button variant="outline-success" onClick={asignarTodo} className="w-100">
                                Asignar todo <i className="fas fa-sync-alt" />
                            </Button>
                        </div>
                        <div className="col-md-4">
                            <Button variant="outline-danger" onClick={revocarTodo} className="w-100">
                                Revocar todo <i className="fas fa-ban" />
                            </Button>
                        </div>
                    </div>

                    <FormControl
                        type="text"
                        placeholder="Buscar permisos"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="mb-3"
                    />

                    {loading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredPermissions}
                            pagination
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[5, 10, 25, 50]}
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={newPerPage => {
                                setPerPage(newPerPage);
                                setCurrentPage(1);
                            }}
                            onChangePage={page => setCurrentPage(page)}
                            highlightOnHover
                            responsive
                            customStyles={customStyles}
                        />
                    )}
                </Card.Body>
            </Card>
        </AuthenticatedLayout>
    );
}
