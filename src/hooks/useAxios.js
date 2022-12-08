import {useEffect} from "react";
import axios from "../api/axios";
const useAxios = () => {
    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                const accessToken = localStorage.getItem('token');
                if (!config.headers['Authorization'] && accessToken && !config.url.includes('/auth')) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                }

                const username = localStorage.getItem('username');
                if (!config.headers['username'] && username) {
                    config.headers['username'] = username;
                }

                return config;
            }
        )

        return () => {
            axios.interceptors.request.eject(requestIntercept);
        }
    }, [])
    return axios;
}

export default useAxios;