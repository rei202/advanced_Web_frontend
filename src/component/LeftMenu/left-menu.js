import React, { useState } from 'react';
import './left-menu.css';
import { Button, ListGroup, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import preIcon from '../../assets/images/presentation.png';
import groupIcon from '../../assets/images/people.png';
import {useLocation, useNavigate} from 'react-router';

const LeftMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const listElement = location.pathname.split('/');
    return (
        <>
            <ListGroup>
                <NavLink to={'/'} className={'navlink-text'}>
                    <ListGroup.Item action className='border-0 text-start'
                                    active={listElement.includes('group')}
                                    onClick={() => navigate('/group')}>
                        <img height={25} src={groupIcon} style={{ marginBottom: '5px' }}></img> Group
                    </ListGroup.Item>
                </NavLink>
                <NavLink to={'/presentation'} className={'navlink-text'}>
                    <ListGroup.Item action className='border-0 text-start'
                                    active={listElement.includes('presentation')}
                                    onClick={() => navigate('/presentation')}>
                        <img height={25} src={preIcon}></img> Presentation
                    </ListGroup.Item>
                </NavLink>
            </ListGroup>
        </>
    );
};
export default LeftMenu;
