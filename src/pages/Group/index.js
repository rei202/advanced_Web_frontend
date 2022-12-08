import './Group.css';

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import ListOwnerView from '../../component/list/ListOwnerView';
import ListMemberView from '../../component/list/ListMemberView';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreLinkCenteredModal from '../../component/list/Modal/CreLinkCenteredModal';

const Group = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    searchParams.get('id');
    const [listOwner, setListOwner] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [listMember, setListMember] = useState([]);
    const [myAccountInGroup, setMyAccountInGroup] = useState({});
    const [showModal, setShowModal] = useState(false);

    const axios = useAxios();

    const handlerUpgrade = (data) => {
        const d = {
            username: data,
            groupId: searchParams.get('id'),
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

    const handlerDelete = (data) => {
        const d = {
            username: data,
            groupId: searchParams.get('id'),
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
        axios
            .get('api/participant/1?' + searchParams)
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
    }, []);

    return (
        <>
            {' '}
            <div className='admin-assignment-wapper'>
                <h3 className='role-title'>Admin</h3>
                <div className='cre-link-btn-wapper'>
                    <Button
                        variant='outline-info'
                        onClick={() => setShowModal(true)}
                    >
                        {/* <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '5px' }} /> */}
                        Invite participant
                    </Button>{' '}
                </div>
            </div>
            <hr />
            <ListOwnerView props={listOwner}></ListOwnerView>
            <h3 className='role-title'>Member</h3>
            <hr />
            <ListMemberView
                props={listMember}
                myRole={myAccountInGroup.roleUserInGroup}
                handlerDelete={handlerDelete}
                handlerUpgrade={handlerUpgrade}
            ></ListMemberView>
            <CreLinkCenteredModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default Group;
