import { Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import Context from '../contexts/Context';

PreferenceForm.propTypes = {
    show: PropTypes.bool,
    proposal: PropTypes.object,
    handleAdd: PropTypes.func,
    handleEdit: PropTypes.func,
    setShow: PropTypes.func
}

export default function PreferenceForm(props) {

    const { show, proposal, handleAdd, handleEdit, setShow } = props;
    const [score, setScore] = useState(proposal.score);
    const { setErrorMessage } = useContext(Context);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (score > 3 || score < 1) {
            setErrorMessage('Wrong value');
            return;
        }
        if (proposal.score === 0) {
            handleAdd({ proposalId: proposal.proposalId , score: score});
        } else {
            handleEdit({ proposalId: proposal.proposalId, score: score });
        }
        setScore(0);
        setShow(false);
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create Process</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="cost">
                        <Form.Label>Cost</Form.Label>
                        <Form.Control
                            required
                            min={1}
                            max={3}
                            step={1}
                            type="number"
                            placeholder="Score..."
                            value={score}
                            onChange={event => setScore(event.target.value)}
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