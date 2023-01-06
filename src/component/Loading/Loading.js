import Spinner from 'react-bootstrap/Spinner';
import './loading.css';

const Loading = () => {
    return (
        <>
            <div className='loading-wapper'>
                <Spinner animation='border' role='status' style={{position : "absolute", top : '50%', left : '50%'}}
                         className='text-bg-primary'>
                    <span className='visually-hidden'>Loading...</span>
                </Spinner>
            </div>
        </>
    );
};

export default Loading;
