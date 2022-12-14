import React, { useState } from 'react';
import './left-menu.css';
import {Button, ListGroup, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router';

const LeftMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = location.pathname.split('/').at(-1);
    return (
        <>
            <ListGroup>
                <ListGroup.Item active={currentPage == 'group'} action
                                className='border-0 text-start'
                                onClick={() => navigate('/group')}>
                    Group
                </ListGroup.Item>
                <ListGroup.Item active={currentPage == 'presentation'} action
                                className='border-0 text-start'
                                onClick={() => navigate('/presentation')}>
                    Presentation
                </ListGroup.Item>
            </ListGroup>
        </>
    );
};
export default LeftMenu;
