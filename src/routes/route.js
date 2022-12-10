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
import Signup from "../pages/Signup/sign-up";
import Login from "../pages/Login/login";

const privateRoutes = [
    { path: '/profile', element: Profile, haveLayout: true },
    { path: '/group', element: Group, haveLayout: true },
    { path: '/invite/*', element: Invite },
    { path: '/', element: Home },
    { path: '/presentation', element: Presentation, haveLayout : true },
    { path: '/presentation/:id', element: PresentationDetail },
    { path: '/presentation-voting/:id', element: PresentationVotingDetail },
    { path: '/presentation/:id/present', element: SlidePresent },
];

const publicRoutes = [
    { path: '/register', element: Signup, haveLayout: true },
    { path: '/login', element: Login, haveLayout: true },
    { path: '/presentation-voting', element: PresentationVoting },
    { path: '/presentation-voting/:id', element: PresentationVotingDetail },
];

export { privateRoutes, publicRoutes };
