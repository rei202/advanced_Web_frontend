import React, { useEffect, useState } from 'react';
import './Home.css';
import ListGroupView from '../../component/list/ListGroupView';
import { useSearchParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import CreGroupCenteredModal from '../../component/list/Modal/CreGroupCenteredModal';
import EmptyNotification from '../../component/EmptyNotification';
import useGroupApi from '../../api/useGroupApi';
function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const groupApi = useGroupApi();
    const [listMyGroup, setListMyGroup] = useState([]);
    const [listParticipating, setListParticipating] = useState([]);
    const axios = useAxios();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (searchParams.has('access_token')) searchParams.delete('access_token');
        if (searchParams.has('username')) searchParams.delete('username');
        setSearchParams(searchParams);
        axios
            .get('api/group/1')
            .then((res) => {
                setListMyGroup(
                    res.data.filter((value) => {
                        return value.roleUserInGroup === 'ROLE_OWNER';
                    })
                );
                setListParticipating(
                    res.data.filter((value) => {
                        return value.roleUserInGroup === 'ROLE_MEMBER' || value.roleUserInGroup === 'ROLE_COOWNER';
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    console.log(listMyGroup);

    const handleCreateGroup = (data) => {
        setListMyGroup(listMyGroup.concat(data));
    };
    const handleDeleteGroup = (id) => {
        const data = {
            groupId: id,
        };

        groupApi.deleteGroup(data).then((res) => {
            console.log(res);
            setListMyGroup(
                listMyGroup.filter((value) => {
                    return value.group.id !== res.data.id;
                })
            );
        });
    };

    return (
        <>
            {console.log(listMyGroup.length)}
            <div className='admin-title-wapper'>
                <h3 className='role-title'>Your Own</h3>
                <div className='cre-group-btn-wapper'>
                    <Button variant='outline-info' onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '5px' }} />
                        Create a group
                    </Button>{' '}
                </div>
            </div>
            <hr />
            {listMyGroup.length === 0 ? (
                <EmptyNotification props={'Nothing to show. Try to add one'} />
            ) : (
                <ListGroupView handlerDeleteGroup={handleDeleteGroup} props={listMyGroup} />
            )}

            <h3 className='role-title'>Participation</h3>
            <hr />
            {listParticipating.length === 0 ? (
                <EmptyNotification props={"Nothing to show. Let's participate some groups "} />
            ) : (
                <ListGroupView props={listParticipating} />
            )}
            <div style={{ marginBottom: '20px' }}></div>
            <CreGroupCenteredModal handler={handleCreateGroup} show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
}

export default Home;
