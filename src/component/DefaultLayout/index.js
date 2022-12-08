import React from 'react';
import NavBar from '../../component/NavBar';
import './DefaultLayout.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function DefaultLayout({ children }) {
    return (
        <>
            <Container fluid={true}>
                <Row className='layout-row' bsPrefix='row'>
                    <Col className='left-col' sm={4}>
                        <NavBar />
                    </Col>
                    <Col className='right-col' sm={8}>
                        {children}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default DefaultLayout;
