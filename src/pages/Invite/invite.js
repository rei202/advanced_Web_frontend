import useAxios from '../../hooks/useAxios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Invite = () => {
    const axios = useAxios();
    const navigate = useNavigate();
    useEffect(() => {
        const groupId = localStorage.getItem('group_id');
        if (groupId) {
            axios
                .get(`https://advancedwebbackend-production-1b23.up.railway.app/api/group/invite/${groupId}`)
                .then((resp) => {
                    console.log();
                    navigate(`/group/${groupId}`);
                })
                .catch((err) => {})
                .finally(() => {
                    localStorage.removeItem('group_id');
                });
        }
    }, []);
};

export default Invite;
