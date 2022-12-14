import {FC} from "react";
import {useNavigate, Navigate, useLocation} from "react-router";

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const url = window.location.href;
    let searchParams = new URLSearchParams(url.split('#').at(-1));
    const location = useLocation();
    if (location.pathname.startsWith('/invite')) {
        const groupId = location.pathname.split('/').at(-1);
        localStorage.setItem('group_id', groupId);
    }
    else localStorage.removeItem('group_id');

    if (searchParams.has('access_token') && searchParams.has('username')) {
        localStorage.setItem('token', searchParams.get('access_token'));
        localStorage.setItem('username', searchParams.get('username'));
    }
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
        return <Navigate to='/login'/>;
    }
    return children;
};

export default RequireAuth;