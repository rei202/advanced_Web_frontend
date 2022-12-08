import thumnail from '../../../assets/images/group-thumnail.jpg';
import './AdminView.css';


const AdminView = ({ props }) => {
    return (
        <>
            <div className='member-item'>
                <div className='mi-info'>
                    <img src={thumnail} alt='#' width='40' height='40' />
                    <span>{props.user.fullName}</span>
                </div>
                <div>{props.roleUserInGroup === 'ROLE_OWNER' ? 'Owner' : 'Co-Owner'}</div>
            </div>
            <hr />
        </>
    );
};

export default AdminView;
