import { Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';

ProposalForm.propTypes = {
    show: PropTypes.bool,
    proposal: PropTypes.object,
    handleAdd: PropTypes.func,
    handleEdit: PropTypes.func,
    setShow: PropTypes.func
}

export default function ProposalForm(props) {

    const { show, proposal, handleAdd, handleEdit, setShow } = props;
    const [description, setDescription] = useState(proposal === null ? '' : proposal.description);
    const [cost, setCost] = useState(proposal === null ? 0 : proposal.cost);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (proposal === null) {
            handleAdd({ description: description, cost: cost });
        } else {
            handleEdit({proposalId: proposal.proposalId, description: description, cost: cost });
        }
        setDescription('');
        setCost(0);
        setShow(false);
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create Process</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Description..."
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="cost">
                        <Form.Label>Cost</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="Cost..."
                            value={cost}
                            onChange={event => setCost(event.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}