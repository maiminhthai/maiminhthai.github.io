import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import Context from '../contexts/Context';
import { Role } from "../models/User.mjs";

function SideBar() {
    const { user, process } = useContext(Context);
    const navigate = useNavigate();
    return (
        <Nav justify variant="tabs" className="flex-column">
            {user !== null && user.role === Role.ADMIN &&
            <Nav.Item>
                <Nav.Link onClick={() => navigate('/activities/process')}>Process</Nav.Link>
                </Nav.Item>}
            {user !== null && (user.role === Role.ADMIN || user.role === Role.MEMBER) && process.phase === 1 &&
                <Nav.Item>
                    <Nav.Link onClick={()=>navigate('/activities/proposals')}>Your Proposals</Nav.Link>
                </Nav.Item>}
            {user !== null && (user.role === Role.ADMIN || user.role === Role.MEMBER) && process.phase === 2 &&
                <Nav.Item>
                    <Nav.Link onClick={() => navigate('/activities/preferences')}>Your Preferences</Nav.Link>
                </Nav.Item>}
            {process.phase === 3 &&
                <Nav.Item>
                    <Nav.Link onClick={() => navigate('/activities/approved')}>Approved Activities</Nav.Link>
                </Nav.Item>}
        </Nav>
    )
}

export default SideBar;
