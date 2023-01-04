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
import useSlideApi from "../../../api/useSlideApi";
import useContentApi from "../../../api/useContentApi";
import {Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis} from "recharts";

const PresentationVotingDetail = () => {
    const {handleSubmit, register} = useForm();
    const params = useParams();
    const slideId = params.id;
    const axios = useAxios();
    const slideApi = useSlideApi();
    const contentApi = useContentApi();
    const [listOptionVote, setListOptionVote] = useState([
        {
            "id": 5,
            "name": "Option 12",
            "numberVote": 10,
        }
    ]);
    const reloadOptionVote = () => {
        slideApi.getSlideDetail(slideId)
            .then(resp => {
                return resp?.data?.content?.id;
            })
            .then(contentId => {
                return contentApi.getContentDetail(contentId);
                // return axios.get('/api/v1/slide-type', {params: {contentId: contentId}})
            })
            .then(resp => {
                const optionList = resp?.data?.listContentMultipleChoice.map(data => data.option);
                setListOptionVote(optionList);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const [isGraphShow, setIsGraphShow] = useState(false);
    const [maxYValue, setMaxYValue] = useState(0);
    const onSubmit = (data) => {
        const idOption = data?.idOption;
        axios.post('/api/v1/vote', {'slideId': +slideId, optionId: +idOption, createdTime : Date.now()})
            .then(resp => {
                setListOptionVote(listOptionVote.map(option => {
                    if (option.id == idOption) option.numberVote++;
                    if (option.numberVote + 2 > maxYValue) setMaxYValue(option.numberVote + 2);
                    return option;
                }))
                setIsGraphShow(true);

            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        reloadOptionVote();
    }, [])
    return (
        <Container className='h-100' style={{backgroundColor: 'rgb(255,255,255)'}} fluid>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='d-flex flex-column'>
                    <h1>Mentimeter</h1>
                    <div hidden={isGraphShow} style={{margin: 'auto'}}>
                        <h3 className='text-start mb-3'>Title</h3>
                        <div key={'radio'} className="mb-3 d-inline">
                            {listOptionVote.map((option, index) =>
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

                    <div hidden={!isGraphShow}>
                        <ResponsiveContainer  width='60%' aspect={2} className='d-flex align-items-center center-h'>
                            <BarChart data={listOptionVote} width={200} height={200}>
                                <XAxis dataKey={'name'} />
                                <YAxis type='number' domain={[0, maxYValue]} hide />
                                <Bar dataKey='numberVote' fill='#196cff' barSize={70}>
                                    <LabelList dataKey='numberVote' position='top' />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


            </Form>
        </Container>
    );
};

export default PresentationVotingDetail;
