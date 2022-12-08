import Profile from '../pages/Profile';
import Home from '../pages/Home';
import Group from '../pages/Group';
import Invite from '../pages/Invite';
import { Prescription } from 'react-bootstrap-icons';
import Presentation from '../pages/Presentation/presentation';
import PresentationDetail from '../pages/presentation-detail/presentation-detail';
import PresentationVoting from '../pages/presentation-voting/presentation-voting';
import PresentationVotingDetail from '../pages/presentation-voting/presentation-voting-detail/presentation-voting-detail';
import SlidePresent from '../pages/presentation-detail/slide-present/slide-present';

const privateRoutes = [
    { path: '/profile', element: Profile },
    { path: '/group', element: Group },
    { path: '/invite/*', element: Invite },
    { path: '/', element: Home },
    { path: '/presentation', element: Presentation },
    { path: '/presentation/:id', element: PresentationDetail },

    { path: '/presentation-voting', element: PresentationVoting },

    { path: '/presentation-voting/:id', element: PresentationVotingDetail },

    { path: '/presentation/:id/present', element: SlidePresent },
];

export { privateRoutes };
