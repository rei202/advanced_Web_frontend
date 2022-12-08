import './presentation-voting-detail.css'
import {
    Button,
    Container,
    Dropdown, Form
} from "react-bootstrap";
import {useParams} from "react-router";
import useAxios from "../../../hooks/useAxios";
import {useEffect, useState} from "react";
import {useSubmit} from "react-router-dom";
import {useForm} from "react-hook-form";

const PresentationVotingDetail = () => {
    const {handleSubmit, register} = useForm();
    const params = useParams();
    const slideId = params.id;
    const axios = useAxios();
    const [optionVote, setOptionVote] = useState([]);
    const reloadOptionVote = () => {
        axios.get(`/api/v1/slide/${slideId}`)
            .then(resp => {
                return resp?.data?.content?.id;
            })
            .then(contentId => {
                return axios.get('/api/v1/slide-type', {params: {contentId: contentId}})
            })
            .then(resp => {
                const optionList = resp.data.map(data => data.option);
                setOptionVote(optionList);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const onSubmit = (data) => {
        const idOption = data?.idOption;
        axios.post('/api/v1/vote',  {'slideId' : +slideId, optionId : +idOption})
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        reloadOptionVote();
    }, [])
    return (
        <Container style={{backgroundColor: 'rgb(255,255,255)'}} fluid>
            <Form onSubmit={handleSubmit(onSubmit)} >
            <div className='d-flex flex-column'>
                <h1>Mentimeter</h1>
                    <div style={{margin: 'auto'}}>
                        <h3 className='text-start mb-3'>Title</h3>
                        <div key={'radio'} className="mb-3 d-inline">
                            {optionVote.map((option, index) =>
                                <Form.Check className='container-radio' type={'radio'} id={`check-api`} name='group'>
                                    <Form.Check.Input className='custom-radio' type={'radio'} name='idOption'
                                                      value={option.id} isValid
                                        {...register('idOption')}/>
                                    <Form.Check.Label className='text-black'>{option.name}</Form.Check.Label>
                                </Form.Check>
                            )}
                        </div>
                        <Button type='submit' style={{width: '500px'}}>Submit</Button>
                    </div>

            </div>
            </Form>
        </Container>
    );
};

export default PresentationVotingDetail;
