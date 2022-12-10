import React from 'react';
import NavBar from '../NavBar/nav-bar';
import './DefaultLayout.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Button, Dropdown, Form, ListGroup, Modal, Nav, Navbar, NavDropdown, Table} from "react-bootstrap";
import {CaretRightSquareFill} from "react-bootstrap-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH} from "@fortawesome/free-solid-svg-icons";
import LeftMenu from "../LeftMenu/left-menu";

function DefaultLayout({ children }) {
    return (
        <>
            <Container fluid className='h-100'>
                {/*Nav bar*/}
                <Row>
                    <NavBar/>
                </Row>
                {/*Content*/}
                <Row className='h-100'>
                    {/*Left Menu*/}
                    <Col xs={2} id='left-side' className='p-0'>
                        <LeftMenu/>
                    </Col>
                    {/*Content*/}
                    <Col id='right-side'>
                        {children}
                    </Col>
                </Row>

            </Container>
        </>
    );
}

export default DefaultLayout;
