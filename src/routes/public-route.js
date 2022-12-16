import {FC} from "react";
import {useNavigate, Navigate} from "react-router";
import {Cone} from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";

const PublicRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    const navigate = useNavigate();
    if (localStorage.getItem('token') && localStorage.getItem('token') != "") {
        return <Navigate to='/group'/>;
    }
    else {
        return (
            <Container fluid className='h-100 bg-white'>
                {children}
            </Container>
        );
    }
};

export default PublicRoute;