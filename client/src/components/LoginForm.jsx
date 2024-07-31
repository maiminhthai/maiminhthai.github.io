import PropTypes from "prop-types";
import { useState } from "react";
import { Form, Button, Row, Alert, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

LoginForm.propTypes = {
    loginHandler: PropTypes.func.isRequired
}

function LoginForm(props) {
    const { loginHandler } = props;

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const credentials = { username, password };
            await loginHandler(credentials);
            navigate('/');
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <Row className="mt-3 vh-100 justify-content-md-center">
            <Col>
                <h1 className="pb-3">Login</h1>
                <Form onSubmit={submitHandler}>
                    <Alert
                        dismissible
                        show={errorMessage !== ''}
                        onClose={() => setErrorMessage('')}
                        variant="danger">
                        {errorMessage}
                    </Alert>
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="username..."
                            value={username}
                            onChange={event => setUserName(event.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="password..."
                            value={password}
                            minLength={6}
                            onChange={event => setPassword(event.target.value)} />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-3">Login</Button>
                </Form>
            </Col>
        </Row>
    )
}

export default LoginForm;