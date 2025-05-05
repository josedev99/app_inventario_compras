import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PermissionAssigner({ show, onClose }) {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        if (show) {
            axios.get(route('roles.getRoles')).then(res => setRoles(res.data.data));
        }
    }, [show]);

    useEffect(() => {
        if (selectedRole) {
            axios.get(route('asignar.getDataIndexAsignar'), {
                params: { role_id: selectedRole }
            }).then(res => setPermissions(res.data.data));
        }
    }, [selectedRole]);

    const togglePermission = async (permissionId, assign) => {
        try {
            await axios.post(route('asignar.storeAsignarPermisosRoles'), {
                role_id: selectedRole,
                permission_id: permissionId,
                assign: assign
            });
            Swal.fire('Hecho', assign ? 'Permiso asignado' : 'Permiso revocado', 'success');
            // recargar permisos actualizados
            const res = await axios.get(route('asignar.getDataIndexAsiganr'), {
                params: { role_id: selectedRole }
            });
            setPermissions(res.data.data);
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'Ocurrió un error', 'error');
        }
    };

    const handleCheckAll = async (action) => {
        const url = action === 'assign' ? route('asignar.AsignarTodo') : route('asignar.RevocarTodo');
        try {
            await axios.post(url, { role_id: selectedRole });
            Swal.fire('Hecho', `Permisos ${action === 'assign' ? 'asignados' : 'revocados'} correctamente`, 'success');
            const res = await axios.get(route('asignar.getDataIndexAsiganr'), {
                params: { role_id: selectedRole }
            });
            setPermissions(res.data.data);
        } catch (err) {
            Swal.fire('Error', 'Algo salió mal', 'error');
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Asignar permisos a un rol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                        <option value="">Elegir</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-between mb-3">
                    <Button variant="outline-success" onClick={() => handleCheckAll('assign')}>Asignar todo</Button>
                    <Button variant="outline-danger" onClick={() => handleCheckAll('revoke')}>Revocar todo</Button>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Asignado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map(permission => (
                            <tr key={permission.id}>
                                <td>{permission.id}</td>
                                <td>{permission.name}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={permission.asignado}
                                        onChange={() => togglePermission(permission.id, !permission.asignado)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal.Body>
        </Modal>
    );
}
