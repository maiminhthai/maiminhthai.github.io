import { useContext, useState } from 'react';
import Context from '../contexts/Context';
import API from '../API.mjs';
import { Role } from '../models/User.mjs';
import { Button, Container, Modal, Form } from 'react-bootstrap';

export default function ProcessLayout() {
    const { setErrorMessage, setReloadProcess, user, process, setLoadApprovedList } = useContext(Context);
    const [show, setShow] = useState(false);
    const [budget, setBudget] = useState(0);

    const handleCreateProcess = async (event) => {
        event.preventDefault();
        try {
            await API.createProcess(budget);
            setReloadProcess(true);
            setShow(false);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleNextPhase = async () => {
        try {
            await API.updatePhase();
            setReloadProcess(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleCompmuteApproved = async () => {
        try {
            await API.computeApproved();
            setLoadApprovedList(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleResatartProcess = async () => {
        try {
            await API.deleteProcess();
            setReloadProcess(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <Container fluid>
            {user !== null && user.role === Role.ADMIN && process.phase === 0 &&
                <>
                    <h1>There is no process at the moment</h1>
                    <Button onClick={()=>setShow(true)}>Start a new process</Button>
                </>}
            {user !== null && user.role === Role.ADMIN && process.phase !== 0 &&
                <>
                    <h1>Phase: {process.phase}</h1>
                    <h2>Budget: {process.budget}</h2>
                {process.phase !== 3 && <Button onClick={handleNextPhase}>Next Phase</Button>}
                {process.phase === 3 && <Button onClick={handleCompmuteApproved}>Compmute Approved List</Button>}
                {' '}
                {process.phase === 3 && <Button onClick={handleResatartProcess}>Restart Process</Button>}
                </>}
            <Modal show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Process</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="budget">
                            <Form.Label>Budgget</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Budget..."
                                value={budget}
                                onChange={event => setBudget(event.target.value)}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" type='submit' onClick={handleCreateProcess}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}