import './slide-edit.css';
import {
    Button,
    Form,
    ListGroup, Row
} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {faImage} from "@fortawesome/free-regular-svg-icons/faImage";
import useAxios from "../../../hooks/useAxios";
import useContentApi from "../../../api/useContentApi";

const SlideEdit = (props) => {
    const axios = useAxios();
    const slide = props.slide;
    const contentApi = useContentApi();
    const [listOption, setListOption] = useState([]);
    const [initTitleValue, setInitTitleValue] = useState(slide?.content?.title);
    const [initialOptionListName, setInitialOptionListName] = useState([]);
    const reloadListOption = () => {
        contentApi.getContentDetail(slide?.content?.id)
            .then(resp => {
                setListOption(resp?.data);
                setInitialOptionListName(resp?.data.map(respData => respData.option.name));
            })
            .catch(err => {

            })
    }

    useEffect(() => {
        reloadListOption();
        setInitTitleValue(slide?.content?.title);

    }, [slide])
    const addNewOption = () => {
        const length = listOption.length + 1;
        axios.post('/api/v1/slide-type/create-multiple-choice', {contentId : slide?.content?.id, optionName : `Option ${length}`})
            .then(
                resp => {
                    reloadListOption();
                    props.changeValue();
                }
            )
            .catch(
                err => {
                    console.log(err);
                }
            )
    }
    const deleteOption = (option) => {
        axios.post('/api/v1/slide-type/delete-multiple-choice', {slideTypeId : option?.option?.id, slideType : 1})
            .then(resp => {
                reloadListOption();
                props.changeValue();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const [timeoutEvent, setTimeOutEvent] = useState(null);
    const onInputChange = (e) => {
        setInitTitleValue(e.target.value);
        if (timeoutEvent) clearTimeout(timeoutEvent);
        setTimeOutEvent(setTimeout(() => {
            axios.post('/api/v1/slide-type/edit', {'contentId' : slide?.content?.id, 'title' : e.target.value})
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutEvent);
                })
                .catch(err => {
                    console.log(err);
                })
        }, 2000));
    }

    const onOptionInputChange = (e, option, i) => {
        initialOptionListName[i] = e.target.value;
        setInitialOptionListName(initialOptionListName);
        if (timeoutEvent) clearTimeout(timeoutEvent);

        setTimeOutEvent(setTimeout(() => {
            axios.post('/api/v1/slide-type/edit-multiple-choice', {'slideType' : 1, 'optionName' : e.target.value, 'slideTypeId' : option?.option?.id })
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutEvent);
                })
                .catch(err => {
                    console.log(err);
                })
        }, 2000));
    }

    return (
        <>
            <Row className='mb-4'>
                <p className='text-start text-black p-0'>
                    <b>Slide type</b>
                </p>
                <Form.Select aria-label="Default select example">
                    <option value="1">Multiple Choice</option>
                    <option value="2">Word Cloud</option>
                    <option value="3">Open Ended</option>
                </Form.Select>
            </Row>
            <hr style={{marginLeft : '-24px', marginRight : '-24px'}}/>
            <Row>
                <p className='text-start text-black p-0'>
                    <b>Your Question</b>
                </p>
                <input value={initTitleValue} type='text' className='form-control' id='title'
                        onChange={e => onInputChange(e)}/>
                <p className='text-start text-black p-0 mt-3'>
                    <b>Options</b>
                </p>
                {
                    listOption.map((option, i) =>
                        <div key={i} className='d-flex mb-2 p-0'>
                            <div className='flex-grow-1 me-3'>
                                <Form.Control value={initialOptionListName[i]} className='flex-grow-1 me-1'
                                            onChange={(e) => onOptionInputChange(e, option, i)}/>
                            </div>
                            <div className='d-flex align-items-center me-3'>
                                <FontAwesomeIcon className='text-primary' icon={faImage} size='1x'/>
                            </div>
                            <div className='d-flex align-items-center me-3'>
                                <FontAwesomeIcon className='text-secondary' icon={faXmark} size='1x'
                                                 style={{cursor : 'pointer'}} onClick={() => deleteOption(option)}/>
                            </div>
                        </div>
                    )
                }
                <Button variant='secondary' onClick={() => addNewOption()}>
                    <FontAwesomeIcon icon={faPlus} className={'me-2'}/>
                    <span>Add option</span>
                </Button>
            </Row>
        </>
    );
};

export default SlideEdit;
