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
    const slideId = props.slideId;
    const contentApi = useContentApi();
    const [listOption, setListOption] = useState([
        {
            "id" : null,
            "content" : {
                "id" : null,
                "slideType" : 1,
                "title" : "title"
            },
            "option" : {
                "id" : null,
                "name" : "name option",
                "numberVote" : 0
            }
        }
    ]);
    const [slide, setSlide] = useState(
        {
            "id" : 1,
            "slideType" : 1,
            "title" : "slide-edit-name"
        }
    );
    const [initTitleValue, setInitTitleValue] = useState();
    const [initialOptionListName, setInitialOptionListName] = useState([]);
    const [heading, setHeading] = useState("");
    const [subheading, setSubheading] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [slideTypeId, setSlideTypeId] = useState();
    const reloadContentDetail = () => {
        contentApi.getContentDetail(slideId)
            .then(resp => {
                const slideTmp = resp?.data?.content;
                setSlide(slideTmp);
                setInitTitleValue(slideTmp?.title);
                if (slideTmp.slideType == 1) {
                    setListOption(resp?.data?.listContentMultipleChoice);
                    setInitialOptionListName(resp?.data?.listContentMultipleChoice.map(respData => respData.option.name));
                } else if (slideTmp.slideType == 2) {
                    setHeading(resp?.data?.heading);
                    setParagraph(resp?.data?.paragraph)
                    setSlideTypeId(resp?.data?.slideTypeId);
                } else {
                    setHeading(resp?.data?.heading);
                    setSubheading(resp?.data?.subheading);
                    setSlideTypeId(resp?.data?.slideTypeId);
                }

            })
            .catch(err => {

            })
    }


    useEffect(() => {
        if (slideId) reloadContentDetail();
    }, [slideId])
    const addNewOption = () => {
        const length = listOption.length + 1;
        axios.post('/api/v1/slide-type/create-multiple-choice', {contentId : slideId, optionName : `Option ${length}`})
            .then(
                resp => {
                    reloadContentDetail();
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
        axios.post('/api/v1/slide-type/delete-multiple-choice', {slideTypeId : option?.id, slideType : 1})
            .then(resp => {
                reloadContentDetail();
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
            axios.post('/api/v1/slide-type/edit', {'contentId' : slideId, 'title' : e.target.value})
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutEvent);
                })
                .catch(err => {
                    console.log(err);
                })
        }, 2000));
    }

    const [timeoutHeading, setTimeoutHeading] = useState(null);
    const onHeadingChange = (e, slideType) => {
        const jsonDataObj = {};
        let apiValue = 'edit-content-paragraph';
        jsonDataObj['slideTypeId'] = slideTypeId;
        jsonDataObj['heading'] = e.target.value;
        if (slideType == 2) {
            jsonDataObj['paragraph'] = paragraph;
        } else {
            apiValue = 'edit-content-heading';
            jsonDataObj['subHeading'] = subheading
        }
        setHeading(e.target.value);
        if (timeoutHeading) clearTimeout(timeoutHeading);
        setTimeoutHeading(setTimeout(() => {
            axios.post(`/api/v1/slide-type/${apiValue}`, jsonDataObj)
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutHeading);
                })
                .catch(err => {
                    console.log(err);
                })
        }, 2000));
    }

    const [timeoutParagraph, setTimeoutParagraph] = useState(null);
    const onParagraphChange = (e) => {
        setParagraph(e.target.value);
        if (timeoutParagraph) clearTimeout(timeoutParagraph);
        setTimeoutParagraph(setTimeout(() => {
            axios.post('/api/v1/slide-type/edit-content-paragraph', {'slideTypeId' : slideTypeId, 'heading' : heading, 'paragraph' : e.target.value})
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutParagraph);
                })
                .catch(err => {
                    console.log(err);
                })
        }, 2000));
    }

    const [timeoutSubheading, setTimeoutSubheading] = useState(null);
    const onSubheadingChange = (e) => {
        setSubheading(e.target.value);
        if (timeoutSubheading) clearTimeout(timeoutSubheading);
        setTimeoutSubheading(setTimeout(() => {
            axios.post('/api/v1/slide-type/edit-content-heading', {'slideTypeId' : slideTypeId, 'heading' : heading, 'subHeading' : e.target.value})
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutSubheading);
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
            axios.post('/api/v1/slide-type/edit-multiple-choice', {'slideType' : 1, 'optionName' : e.target.value, 'slideTypeId' : option?.id })
                .then(resp => {
                    props.changeValue();
                    clearTimeout(timeoutEvent);
                })
                .catch(err => {
                    console.log(err);
                })
        }, 2000));
    }

    const onSlideTypeChange = (event) => {
        const newSlideType = event.target.value;
        if (newSlideType == 1) {
            // multiple choice
            if (slide.slideType == 1) return;
            contentApi.createMultipleChoiceOption(
                {
                    contentId : slide.id,
                    optionName : null,
                }
            )
                .then(
                    (resp) => {
                        reloadContentDetail();
                        props.changeValue();
                    }
                )
        } else if (newSlideType == 2) {
            //Content Paragraph
            if (slide.slideType == 2) return;
            contentApi.createParagraphSlide(
                {
                    contentId : slide.id,
                    heading : 'heading',
                    paragraph : 'paragraph'
                }
            )
                .then(
                    (resp) => {
                        reloadContentDetail()
                        props.changeValue();
                    }
                )

        } else {
            // Heading
            if (slide.slideType == 3) return;
            contentApi.createHeadingSlide(
                {
                    contentId : slide.id,
                    heading : 'heading',
                    subHeading : 'subheading'
                }
            )
                .then((resp) => {
                    reloadContentDetail()
                    props.changeValue();
                })
        }
    }

    const slideEditMultipleChoice = () => {
        return (
            <>
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
            </>
        )
    }

    const slideEditParagraph = () => {
        return (
            <>
                <p className='text-start text-black p-0'>
                    <b>Heading</b>
                </p>
                <input value={heading} type='text' className='form-control' id='title'
                       onChange={e => onHeadingChange(e, 2)}/>

                <p className='text-start text-black p-0 mt-5'>
                    <b>Paragraph</b>
                </p>
                <textarea value={paragraph} className='form-control' id='paragraph'
                          style={{height : '150px'}}
                          onChange={e => onParagraphChange(e)} maxLength={800}/>
            </>
        )
    }

    const slideEditHeading = () => {
        return (
            <>
                <p className='text-start text-black p-0'>
                    <b>Heading</b>
                </p>
                <input value={heading} type='text' className='form-control' id='title'
                       onChange={e => onHeadingChange(e, 3)}/>

                <p className='text-start text-black p-0 mt-5'>
                    <b>Subheading</b>
                </p>
                <textarea value={subheading} className='form-control' id='subheading'
                          readOnly={false}
                          style={{height : '110px'}}
                          onChange={e => onSubheadingChange(e)} maxLength={500}/>
            </>
        )
    }

    const slideEditUI = () => {
        if (slide.slideType == 1) return slideEditMultipleChoice()
        else if (slide.slideType == 2) return slideEditParagraph()
        else return slideEditHeading();
    }

    return (
        <>
            <Row className='mb-4'>
                <p className='text-start text-black p-0'>
                    <b>Slide type</b>
                </p>
                <Form.Select aria-label="Default select example"
                    onChange={onSlideTypeChange} value={slide.slideType}>
                    <option value="1">Multiple Choice</option>
                    <option value="2">Paragraph</option>
                    <option value="3">Heading</option>
                </Form.Select>
            </Row>
            <hr style={{marginLeft : '-24px', marginRight : '-24px'}}/>
            <Row>
                {slideEditUI()}
            </Row>
        </>
    );
};

export default SlideEdit;
