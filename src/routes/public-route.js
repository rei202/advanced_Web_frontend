import {FC} from "react";
import {useNavigate, Navigate} from "react-router";

const PublicRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    // const accessToken = localStorage.getItem('token');
    // if (accessToken) {
    //     // const group_id = localStorage.getItem('group_id');
    //     // if (group_id) return <Navigate to={`invite/${group_id}`}/>;
    //     return <Navigate to='/'/>;
    // }
    return children;
};

export default PublicRoute;