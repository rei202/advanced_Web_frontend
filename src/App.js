import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes/route";
import RequireAuth from "./routes/required-auth";
import DefaultLayout from "./component/DefaultLayout/default-layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import PublicRoute from "./routes/public-route";




function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.element;
                        return <Route key={index} path={route.path} element={
                            <PublicRoute>
                                <Page/>
                            </PublicRoute>
                        }/>
                    })}

                    {privateRoutes.map((route, index) => {
                        const Page = route.element;
                        if (route.haveLayout){
                            return <Route key={index} path={route.path} element={
                                <RequireAuth>
                                    <DefaultLayout>
                                        <Page />
                                    </DefaultLayout>
                                </RequireAuth>
                            } />;
                        } else {
                            return <Route key={index} path={route.path} element={
                                <RequireAuth>
                                    <Page/>
                                </RequireAuth>
                            }/>
                        }
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
