import './slide-window.css';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faChartColumn, faEllipsisH, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const SlideWindow = (props) => {
    const listSlide = props.listSlide || [];
    const choosenSlideId = props.slideId;

    const isSlideActive = (slide) => {
        return slide?.id == choosenSlideId;
    };

    const onSlideClick = (slide) => {
        props.onChoosenSlide(slide);
    };

    return (
        <ListGroup as='ul'>
            {listSlide.map((slide, index) => (
                <ListGroup.Item
                    key={index}
                    as='li'
                    className={`p-0 border-0 ${isSlideActive(slide) ? 'active-slide' : 'non-active-slide'}`}
                    onClick={() => onSlideClick(slide)}>

                    <div className='d-flex slide-window' style={{ padding: '8px 0 8px 0' }}>
                        <div className='d-flex flex-column justify-content-between' md='auto'>
                            <div className='d-flex flex-column'>
                                <span>{index + 1}</span>
                                <span hidden={!isSlideActive(slide)}>
                                    <FontAwesomeIcon size='xl' icon={faCaretRight} className='text-primary' />
                                </span>
                            </div>
                        </div>
                        <div className='flex-grow-1' style={{ padding: '8px' }}>
                            <div
                                className='d-flex justify-content-center align-items-center'
                                style={{ height: '100px', border: '1px solid rgb(183, 186, 194)', backgroundColor: 'white' }}>
                                <FontAwesomeIcon icon={faChartColumn} size='2xl' />
                            </div>
                        </div>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default SlideWindow;
