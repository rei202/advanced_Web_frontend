import React, { useState } from 'react';
import './left-menu.css';
import { Button, ListGroup, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import preIcon from '../../assets/images/presentation.png';
import groupIcon from '../../assets/images/people.png';

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
                <NavLink to={'/'} className={'navlink-text'}>
                    <ListGroup.Item action className='border-0 text-start'>
                        <img height={25} src={groupIcon} style={{ marginBottom: '5px' }}></img> Group
                    </ListGroup.Item>
                </NavLink>
                <NavLink to={'/presentation'} className={'navlink-text'}>
                    <ListGroup.Item action className='border-0 text-start'>
                        <img height={25} src={preIcon}></img> Presentation
                    </ListGroup.Item>
                </NavLink>
            </ListGroup>
        </>
    );
};
export default LeftMenu;
