import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './nav-bar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserCircle, faUserGroup} from '@fortawesome/free-solid-svg-icons';
import {Button, CardImg, Image, Nav, Navbar, NavDropdown} from 'react-bootstrap';
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
                    <Navbar.Brand>
                        <Image src='https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/d9l1t6zmmw2nxrzb95vj'
                                 width={30} height={30}>
                        </Image>
                        <span className='ms-3'>
                            <b>Group 1</b>
                        </span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav className='me-auto'></Nav>
                        <Nav>
                            <FontAwesomeIcon icon={faUserCircle} className='text-primary' size={"2xl"}/>
                            <NavDropdown title={localStorage.getItem('username')} id='collasible-nav-dropdown' align='end'>
                                <NavDropdown.Item onClick={() => navigate('/profile ')}>Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => onSignOut()}>Log out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </>
    );
};
export default NavBar;
