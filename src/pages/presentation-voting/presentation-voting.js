import {
    Button,
    Container,
    Form,
} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import {useState} from "react";
import useAxios from "../../hooks/useAxios";
import useSlideApi from "../../api/useSlideApi";
import useContentApi from "../../api/useContentApi";

const PresentationVoting = () => {

    const axios = useAxios();
    const navigate = useNavigate();
    const slideApi = useSlideApi();
    const [code, setCode] = useState("");
    const [validCode, setValidCode] = useState(true);
    const onSubmitButtonClick = () => {
        setValidCode(true);
        // axios.get(`/api/v1/slide/${code}`)
        slideApi.getSlideDetail(code)
            .then(resp => {
                if (resp?.data?.id) {
                    setValidCode(true);
                    navigate(`./${code}`)
                } else setValidCode(false);
            })
            .catch(err => {
                setValidCode(false);
            })
    }
    return (
        <Container className='h-100' style={{backgroundColor : 'white'}} fluid>
            <div className='d-flex flex-column align-items-center'>
                <h1>Mentimeter</h1>
                <h5 className='mb-3'>Please enter the code</h5>
                <Form.Control className='mb-3' placeholder='1234 5678' onChange={(e) => setCode(e.target.value)} style={{width : '40%'}}/>
                <Button className='mb-3' variant='primary' onClick={() => onSubmitButtonClick()}>Submit</Button>
                <span className='text-danger' hidden={validCode}>Your code is invalid !!</span>
                <span>The code is found on the screen in front of you</span>
            </div>

        </Container>
    );
};

export default PresentationVoting;
