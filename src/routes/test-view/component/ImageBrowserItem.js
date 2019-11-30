import React from 'react';
import { useDrag } from 'react-dnd'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {dropImage} from "Actions";

const ImageBrowserItem = ({item, imageList, showImageList, dropImage}) => {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'DicomImage' },
        end: (dragItem, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dragItem && dropResult) {
                dropImage(item.id, dropResult.index);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div className="ThumbnailEntryContainer">
            <div ref={drag} className="ThumbnailEntry">
                <div className="p-x-1">
                    <div className="ImageThumbnail">
                        <div className="image-thumbnail-canvas">
                            <img
                                className="static-image"
                                src={'http://localhost:3000/dicomimg/' + item.id + '/0/0/0_0.png'}
                                height={123}
                                alt={''}
                            />
                        </div>
                        <div className="image-thumbnail-progress-bar">
                            <div className="image-thumbnail-progress-bar-inner" style={{width: 0}}/>
                        </div>
                    </div>
                </div>
                <div className="series-details">
                    <div className="series-description">SCOUT</div>
                    <div className="series-information">
                        <div className="item item-series">
                            <div className="icon">S:</div>
                            <div className="value">1</div>
                        </div>
                        <div className="item item-series">
                            <div className="icon">I:</div>
                            <div className="value">1</div>
                        </div>
                        <div className="item item-frames">
                            <div className="icon">
                                <div/>
                            </div>
                            <div className="value">2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};


// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        showImageList: state.testView.showImageList
    };
};

export default withRouter(connect(mapStateToProps, {
    dropImage
})(ImageBrowserItem));