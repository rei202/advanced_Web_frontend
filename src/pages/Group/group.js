import './Group.css';

import { useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import ListOwnerView from '../../component/list/ListOwnerView';
import ListMemberView from '../../component/list/ListMemberView';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreLinkCenteredModal from '../../component/list/Modal/CreLinkCenteredModal';
import { useParams } from 'react-router-dom';
import EmptyNotification from '../../component/EmptyNotification';
import PopUp from '../../component/PresentingNotification/presenting-alert';
import PresentingAlert from '../../component/PresentingNotification/presenting-alert';
import PresentingPopUp from '../../component/PresentingNotification/pop-up';
import useNotificationApi from '../../api/useNotificationApi';
import SocketContext from '../../store/Context';
import usePresentingApi from '../../api/usePresentingApi';
import Loading from '../../component/Loading/Loading';
const Group = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    searchParams.get('id');
    const [listOwner, setListOwner] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [listMember, setListMember] = useState([]);
    const [myAccountInGroup, setMyAccountInGroup] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showPresentingPopup, setShowPresentingPopup] = useState(false);
    const [showPresentingNoti, setShowPresentingNoti] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const stompClient = useContext(SocketContext);
    const notificationApi = useNotificationApi();
    const axios = useAxios();
    const { id } = useParams();
    const handlerUpgrade = (data) => {
        const d = {
            username: data,
            groupId: id,
        };
        console.log(d);
        axios
            .post('/api/participant/2', d)
            .then((res) => {
                console.log(res);
                const newMemberList = listMember.filter((value) => {
                    return value.id !== res.data.id;
                });
                const newOwnerList = listOwner.concat(res.data);
                setListMember(newMemberList);
                setListOwner(newOwnerList);
                // setListUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handlerDemote = (data) => {
        const d = {
            username: data,
            groupId: id,
        };
        console.log(d);
        axios
            .post('/api/participant/4', d)
            .then((res) => {
                console.log(res);
                const newOwnerList = listOwner.filter((value) => {
                    return value.id !== res.data.id;
                });
                const newMemberList = listMember.concat(res.data);
                setListMember(newMemberList);
                setListOwner(newOwnerList);
                // setListUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlerDelete = (data) => {
        const d = {
            username: data,
            groupId: id,
        };
        console.log(d);
        axios
            .post('/api/participant/3', d)
            .then((res) => {
                console.log(res);
                const newMemberList = listMember.filter((value) => {
                    return value.id !== res.data.id;
                });
                setListMember(newMemberList);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (stompClient.isConnected) connect();
    }, [stompClient.isConnected]);

    const connect = () => {
        onConnected();
    };

    const onConnected = () => {
        if (stompClient.isConnected) {
            stompClient.client.subscribe(`/topic/notification/${id}`, onNotification);
            setIsLoading(false);
        }
    };
    const onNotification = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (payloadData === true) {
            setShowPresentingNoti(true);
            setShowPresentingPopup(true);
        } else {
            setShowPresentingNoti(false);
        }
    };

    const presentingApi = usePresentingApi();
    const [presentingId, setPresentingId] = useState();
    useEffect(() => {
        axios
            .get('api/participant/1?id=' + id)
            .then((res) => {
                console.log(res);
                const userArr = res.data.userGroupList;
                setMyAccountInGroup(res.data.myAccountInGroup);
                setListUser(userArr);
                setListOwner(
                    userArr.filter((value) => {
                        return value.roleUserInGroup === 'ROLE_OWNER' || value.roleUserInGroup === 'ROLE_COOWNER';
                    })
                );
                setListMember(
                    userArr.filter((value) => {
                        return value.roleUserInGroup === 'ROLE_MEMBER';
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            });

        presentingApi.getPresentingGroup(id).then((resp) => {
            // console.log(resp.data);
            setPresentingId(resp.data[0].id);
        });

        notificationApi.checkPresenting(id).then((res) => {
            if (res.data !== null) {
                setShowPresentingPopup(res.data.isPresenting);
                setShowPresentingNoti(res.data.isPresenting);
            }
        });
    }, []);

    return (
        <>
            {' '}
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div>{showPresentingNoti && <PresentingAlert presentingGroupData={presentingId} />}</div>
                    <div className='admin-assignment-wapper'>
                        <h3 className='role-title'>Admin</h3>
                        <div className='cre-link-btn-wapper'>
                            <Button variant='primary' onClick={() => setShowModal(true)}>
                                {/* <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '5px' }} /> */}
                                Invite participant
                            </Button>{' '}
                        </div>
                    </div>
                    <hr />
                    {listOwner.length === 0 ? (
                        <EmptyNotification props={"Nothing to show. Let's participate some groups "} />
                    ) : (
                        <ListOwnerView props={listOwner} myRole={myAccountInGroup.roleUserInGroup} handlerDemote={handlerDemote}></ListOwnerView>
                    )}
                    <h3 className='role-title'>Member</h3>
                    <hr />
                    {listMember.length === 0 ? (
                        <EmptyNotification props={'There is no any member here !!'} />
                    ) : (
                        <ListMemberView
                            props={listMember}
                            myRole={myAccountInGroup.roleUserInGroup}
                            handlerDelete={handlerDelete}
                            handlerUpgrade={handlerUpgrade}
                        ></ListMemberView>
                    )}
                    <PresentingPopUp show={showPresentingPopup} presentingId={presentingId} onHide={() => setShowPresentingPopup(false)} />
                    <CreLinkCenteredModal show={showModal} onHide={() => setShowModal(false)} />
                </>
            )}
        </>
    );
};

export default Group;
