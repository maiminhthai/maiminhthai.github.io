import { useContext, useEffect, useState } from 'react';
import Context from '../contexts/Context';
import API from '../API.mjs';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';


export default function AporovedLayout() {

    const [approvedList, setApprovedList] = useState([]);
    const [nonApprovedList, setNonApprovedList] = useState([]);

    const { setErrorMessage, user, loadApprovedList, setLoadApprovedList } = useContext(Context);

    useEffect(() => {
        if (user !== null) {
            API.getAllProposals()
                .then(proposals => {
                    setApprovedList(proposals.filter(proposal => proposal.approved).sort((a, b) => b.score - a.score));
                    setNonApprovedList(proposals.filter(proposal => !proposal.approved).sort((a, b) => b.score - a.score));
                })
                .then(() => setLoadApprovedList(false))
                .catch(err => setErrorMessage(err.message));
        } else {
            API.getApprovedList()
                .then(proposals => {
                    setApprovedList(proposals.sort((a, b) => b.score - a.score));
                    setNonApprovedList([]);
                })
                .then(() => setLoadApprovedList(false))
                .catch(err => setErrorMessage(err.message));
        }
    }, [loadApprovedList, setErrorMessage, user, setLoadApprovedList]);

    return (
        <Container fluid>
            <Row>
                <h1>Approved List of activities</h1>
                <ListGroup variant='flush'>
                    {approvedList.map(proposal => <Proposal key={proposal.proposalId}
                        description={proposal.description}
                        cost={proposal.cost}
                        score={proposal.score}
                        author={proposal.author}
                    />)}
                </ListGroup>
            </Row>
            {user !== null && 
                <Row>
                    <h1>Non-Approved List of activities</h1>
                    <ListGroup variant='flush'>
                        {nonApprovedList.map(proposal => <Proposal key={proposal.proposalId}
                            description={proposal.description}
                            cost={proposal.cost}
                            score={proposal.score}
                            author=''
                        />)}
                    </ListGroup>
                </Row>
            }
        </Container>
    );
}

Proposal.propTypes = {
    description: PropTypes.string,
    cost: PropTypes.number,
    score: PropTypes.number,
    author: PropTypes.string
}

function Proposal(props) {
    const { description, cost, score, author } = props;
    return (
        <ListGroupItem>
            <Row className="m-2">
                <Col >
                    {description}
                </Col>
                <Col >
                    {cost}
                </Col>
                <Col >
                    {score}
                </Col>
                <Col>
                    {author}
                </Col>
            </Row>
        </ListGroupItem>
    );
}