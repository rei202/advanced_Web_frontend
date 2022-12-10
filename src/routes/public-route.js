import {FC} from "react";
import {useNavigate, Navigate} from "react-router";
import {Cone} from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";

const PublicRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    return (
        <Container fluid className='h-100'>
            {children}
        </Container>
    );
};

export default PublicRoute;