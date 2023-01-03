import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import SocketProvider from './store/SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
    <QueryClientProvider client={queryClient}>
        <HashRouter>
            <SocketProvider>
                <App />
            </SocketProvider>
        </HashRouter>
    </QueryClientProvider>
);

// root.render(
//   <QueryClientProvider client={queryClient}>
//     <React.StrictMode>
//         <HashRouter >
//             <App />
//         </HashRouter>
//     </React.StrictMode>
//   </QueryClientProvider>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
