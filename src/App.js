import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { privateRoutes } from './routes';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home'; // test xong xoa
import RequireAuth from './routes/required-auth';
import DefaultLayout from './component/DefaultLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import Group from './pages/Group';
import PublicRoute from './routes/public-route';
import Presentation from './pages/Presentation/presentation';
import PresentationDetail from './pages/presentation-detail/presentation-detail';
import PresentationVoting from './pages/presentation-voting/presentation-voting';
import PresentationVotingDetail from './pages/presentation-voting/presentation-voting-detail/presentation-voting-detail';
import SlidePresent from './pages/presentation-detail/slide-present/slide-present';

// const arr = [
//   { path: "/login", element: Login },
//   { path: "/register", element: Signin },
// ];

function App() {
    // console.log(arr);
    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                        path='register'
                    />
                    <Route
                        path='login'
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    {privateRoutes.map((route, index) => {
                        const Page = route.element;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <RequireAuth>
                                        {/* <DefaultLayout> */}
                                        <Page />
                                        {/* </DefaultLayout> */}
                                    </RequireAuth>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
