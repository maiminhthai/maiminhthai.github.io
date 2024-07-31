import { Col, Row } from "react-bootstrap";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import Context from "../contexts/Context";
import { useContext } from "react";
import { Role } from "../models/User.mjs";

export default function ActivitiesLayout() {
    const { user, process} = useContext(Context);
    return (
        <Row className="mt-3 vh-100">
            <Col className="col-3 bg-light">
                <SideBar />
            </Col>
            <Col className="col-9">
                {user === null && process.phase !== 3 && <h1>Activities is still being defined</h1>}
                {user !== null && user.role === Role.MEMBER && process.phase === 0 && <h1>Budget is still being defined</h1>}
                <Outlet />
            </Col>
        </Row>  
    );
}