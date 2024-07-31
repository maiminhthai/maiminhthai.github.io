import { useContext, useEffect, useState } from 'react';
import Context from '../contexts/Context';
import API from '../API.mjs';
import { Button, Container, ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ProposalForm from '../components/ProposalFrom';


export default function ProposalsLayout() {

    const [proposals, setProposals] = useState([]);
    const [show, setShow] = useState(false);
    const [editProposal, setEditProposal] = useState(null);

    const { setErrorMessage, user, reloadProposals, setReloadProposals } = useContext(Context);

    useEffect(() => {
        API.getProposals(user.username)
            .then(proposals => setProposals(proposals))
            .then(() => setReloadProposals(false))
            .catch(err => setErrorMessage(err.message));
    }, [reloadProposals, setErrorMessage, setReloadProposals, user.username]);

    const handleAdd = async (proposal) => {
        try {
            await API.addProposal(proposal);
            setReloadProposals(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleEdit = async (proposal) => {
        try {
            await API.updateProposal(proposal);
            setReloadProposals(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleDelete = async (proposalId) => {
        try {
            await API.deleteProposal(proposalId);
            setReloadProposals(true);
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
            <h1>Your Proposals</h1>
            <ListGroup variant='flush'>
                {proposals.map(proposal => <Proposal key={proposal.proposalId}
                    proposal={proposal}
                    onClickAddEdit={onClickAddEdit}
                    handleDelete={handleDelete} />)}
            </ListGroup>
            <Button onClick={() => onClickAddEdit(null)}>Add Proposal</Button>
            <ProposalForm proposal={editProposal} show={show} handleAdd={handleAdd} handleEdit={handleEdit} setShow={setShow}/>
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
                <Col>
                    <Button onClick={()=>onClickAddEdit(proposal)}>Edit proposal</Button>
                    {' '}
                    <Button onClick={()=>handleDelete(proposal.proposalId)}>Delete Proposal</Button>
                </Col>
            </Row>
        </ListGroupItem>
    );
}