import Spinner from 'react-bootstrap/Spinner';
import './loading.css';

const Loading = () => {
    return (
        <>
            <div className='loading-wapper'>
                <Spinner animation='border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </Spinner>
            </div>
        </>
    );
};

export default Loading;
