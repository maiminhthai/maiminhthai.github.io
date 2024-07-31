import { useContext, useEffect, useState } from 'react';
import Context from '../contexts/Context';
import API from '../API.mjs';
import { Button, Container, ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PreferenceForm from '../components/PreferenceForm';


export default function PreferencesLayout() {

    const [proposals, setProposals] = useState([]);
    const [show, setShow] = useState(false);
    const [editProposal, setEditProposal] = useState({});

    const { setErrorMessage, user, reloadPreferences, setReloadPreferences } = useContext(Context);

    useEffect(() => {
        API.getPreferences(user.username)
            .then(proposals => setProposals(proposals))
            .then(() => setReloadPreferences(false))
            .catch(err => setErrorMessage(err.message));
    }, [reloadPreferences, setErrorMessage, setReloadPreferences, user.username]);

    const handleAdd = async (preference) => {
        try {
            await API.addPreference(preference);
            setReloadPreferences(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleEdit = async (preference) => {
        try {
            await API.updatePreference(preference);
            setReloadPreferences(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleDelete = async (proposalId) => {
        try {
            await API.deletePreference(proposalId);
            setReloadPreferences(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const onClickAddEdit = (proposal) => {
        setEditProposal(proposal);
        setShow(true);
    }

    return (
        <Container fluid>
            <h1>Your Preferences</h1>
            <ListGroup variant='flush'>
                {proposals.map(proposal => <Proposal key={proposal.proposalId}
                    proposal={proposal}
                    onClickAddEdit={onClickAddEdit}
                    handleDelete={handleDelete} />)}
            </ListGroup>
            <PreferenceForm proposal={editProposal} show={show} handleAdd={handleAdd} handleEdit={handleEdit} setShow={setShow} />
        </Container>
    );
}

Proposal.propTypes = {
    proposal: PropTypes.object,
    onClickAddEdit: PropTypes.func,
    handleDelete: PropTypes.func
}

function Proposal(props) {
    const { proposal, onClickAddEdit, handleDelete } = props;
    return (
        <ListGroupItem>
            <Row className="m-2">
                <Col >
                    {proposal.description}
                </Col>
                <Col >
                    {proposal.cost}
                </Col>
                <Col >
                    {proposal.score}
                </Col>
                <Col>
                    <Button onClick={() => onClickAddEdit(proposal)}>Edit Score</Button>
                    {' '}
                    <Button onClick={() => handleDelete(proposal.proposalId)}>Delete Score</Button>
                </Col>
            </Row>
        </ListGroupItem>
    );
}