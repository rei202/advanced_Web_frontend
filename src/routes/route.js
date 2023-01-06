import Profile from '../pages/Profile/profile';
import Home from '../pages/Home/home';
import Group from '../pages/Group/group';
import Invite from '../pages/Invite/invite';
import { Prescription } from 'react-bootstrap-icons';
import Presentation from '../pages/Presentation/presentation';
import PresentationDetail from '../pages/presentation-detail/presentation-detail';
import PresentationVoting from '../pages/presentation-voting/presentation-voting';
import PresentationVotingDetail from '../pages/presentation-voting/presentation-voting-detail/presentation-voting-detail';
import SlidePresent from '../pages/presentation-detail/slide-present/slide-present';
import Signup from '../pages/Signup/sign-up';
import Login from '../pages/Login/login';
import Forgot from '../pages/Forget/forgot';
import ResetPassword from '../pages/reset_password/resets_password';
import SlidePresentGuest from "../pages/presentation-detail/slide-present-guest/slide-present-guest";

const privateRoutes = [
    { path: '/profile', element: Profile, haveLayout: true },
    { path: '/group/:id', element: Group, haveLayout: true },
    { path: '/invite/*', element: Invite },
    { path: '/', element: Home, haveLayout: true },
    { path: '/presentation', element: Presentation, haveLayout: true },
    { path: '/presentation/:id', element: PresentationDetail },
    { path: '/presentation-voting/:id', element: PresentationVotingDetail },
    { path: '/presenting/:id', element: SlidePresent },
    { path: '/presenting-guest/:id', element: SlidePresentGuest },
    { path: '/presentation-voting', element: PresentationVoting },
    { path: '/presentation-voting/:id', element: PresentationVotingDetail },
];

const publicRoutes = [
    { path: '/register', element: Signup, haveLayout: true },
    { path: '/reset_password/:id', element: ResetPassword },
    { path: '/forgot', element: Forgot, haveLayout: true },
    { path: '/login', element: Login, haveLayout: true },
];

export { privateRoutes, publicRoutes };
