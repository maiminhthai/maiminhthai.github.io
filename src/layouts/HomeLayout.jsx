import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function HomeLayout() {
    const navigate = useNavigate();

    const clickHandler = () => {
        navigate('/activities');
    }

    return (
        <Row className="mt-3 vh-100 justify-content-md-center">
            <Col className="justify-content-center">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/non-profit.jpg" />
                    <Card.Body>
                        <Card.Title>Next year activities.</Card.Title>
                        <Card.Text>
                            See all activities plan for next year
                        </Card.Text>
                        <Button variant="primary" onClick={clickHandler}>See Activities</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default HomeLayout