import { Modal, Button, Table } from 'react-bootstrap';

export default function ModalNotificaciones({ show, onClose, compras }) {
    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Finanzas, a mandado la siguiente notificación.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Las siguientes compras han sido: <strong>"APROBADAS"</strong> o <strong>"RECHAZADAS"</strong>:</p>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Código</th>
                            <th>Proveedor</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.map((compra, index) => (
                            <tr key={compra.id}>
                                <td>{index + 1}</td>
                                <td>{compra.codigo}</td>
                                <td>{compra.proveedor}</td>
                                <td><strong>{compra.estado}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}
