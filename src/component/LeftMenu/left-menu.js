import React, { useState } from 'react';
import './left-menu.css';
import {Button, ListGroup, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router';

const LeftMenu = () => {
    const navigate = useNavigate();
    const onSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };
    return (
        <>
            <ListGroup>
                <ListGroup.Item action className='border-0 text-start'>
                    Group
                </ListGroup.Item>
                <ListGroup.Item action className='border-0 text-start'>
                    Presentation
                </ListGroup.Item>
            </ListGroup>
        </>
    );
};
export default LeftMenu;
