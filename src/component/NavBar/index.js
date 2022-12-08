import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const NavBar = () => {
    const navigate = useNavigate();
    const onSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };
    return (
        <>
            <nav className={'nav-menu'}>
                <h3 style={{ color: 'white' }}>Profile Component here</h3>
                <hr className='nav-hr' />
                <div>
                    <ul className='nav-menu-items'>
                        <li className={'nav-text'}>
                            <NavLink to='/'>
                                {/* <FontAwesomeIcon icon={faUserGroup}></FontAwesomeIcon> */}
                                <span>Your Groups</span>
                            </NavLink>
                        </li>
                        <li className={'nav-text'}>
                            <NavLink to='/profile'>
                                <span>Profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <hr className='nav-hr' />
                <div>
                    <Button onClick={() => onSignOut()}>Sign out</Button>
                </div>
            </nav>
        </>
    );
};
export default NavBar;
