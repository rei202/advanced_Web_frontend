import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './nav-bar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import {Button, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Container from "react-bootstrap/Container";

const NavBar = () => {
    const navigate = useNavigate();
    const onSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };
    return (
        <>
            <Container id='custom-navbar'>
                <Navbar expand='lg' variant='light' bg='light'>
                    <Navbar.Brand href='#'>Navbar</Navbar.Brand>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav className='me-auto'></Nav>
                        <Nav>
                            <NavDropdown title='Dropdown' id='collasible-nav-dropdown' align='end'>
                                <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                                <NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
                                <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </>
    );
};
export default NavBar;
