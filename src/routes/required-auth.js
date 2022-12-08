import {FC} from "react";
import {useNavigate, Navigate, useLocation} from "react-router";

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {

    let searchParams = new URLSearchParams(window.location.search.substring(1));
    const location = useLocation();
    if (location.pathname.startsWith('/invite')) {
        const groupId = location.pathname.split('/').at(-1);
        localStorage.setItem('group_id', groupId);
    }
    else localStorage.removeItem('group_id');
    // kiểm tra có redirect_url hay không ? Nếu có thì request

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