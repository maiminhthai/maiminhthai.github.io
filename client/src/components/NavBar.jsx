import { useContext } from 'react';
import Context from '../contexts/Context';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";

NavBar.propTypes = {
    logoutHandler: PropTypes.func.isRequired
}

function NavBar(props) {
    const { user } = useContext(Context);
    const { logoutHandler } = props;
    const navigate = useNavigate();

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                        {user === null ? <Nav.Link onClick={() => navigate('/Login')}>Login</Nav.Link> :
                            <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>}
                    </Nav>
                    <Nav>
                        <Navbar.Text>
                            Signed in as: {user === null ? '' : user.name}
                        </Navbar.Text>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;