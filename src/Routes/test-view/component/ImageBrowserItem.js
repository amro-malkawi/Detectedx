import React from 'react';
import { useDrag } from 'react-dnd'
import withRouter from 'Components/WithRouter';
import {connect} from "react-redux";
import {dropImage} from "Store/Actions";
import ImageThumbnail from "./ImageThumbnail";

const ImageBrowserItem = ({item, imageList, showImageList, dropImage}) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'DicomImage',
        end: (dragItem, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dragItem && dropResult) {
                dropImage(item.id, dropResult.rowIndex, dropResult.colIndex);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });
    // const metaData = JSON.parse(item.metadata);
    const metaData = item.metaData;
    return (
        <div className="ThumbnailEntryContainer">
            <div ref={drag} className="ThumbnailEntry">
                <div className="p-x-1">
                    <div className="ImageThumbnail" style={{boxShadow: 'inset 0 0 0 1px ' + (item.type === 'test' ? '#72787d' : (item.type === 'prior' ? '#73730a' : '#672525'))}}>
                        <ImageThumbnail image_url_path={item.image_url_path} />
                        <div className="image-thumbnail-progress-bar">
                            <div className="image-thumbnail-progress-bar-inner" style={{width: 0}}/>
                        </div>
                    </div>
                </div>
                <div className="series-details">
                    <div className="series-description">
                        {metaData.viewPosition ? metaData.viewPosition : ''}
                        { metaData.positionDesc && <span className={'ms-20 fs-12'}>{metaData.positionDesc}</span> }
                    </div>
                    <div className="series-information">
                        <div className="item item-series">
                            <div className="icon">Laterality</div>
                            <div className="value">{metaData.imageLaterality ? metaData.imageLaterality : ''}</div>
                        </div>
                        <div className="item item-series">
                            <div className="icon">Type:</div>
                            <div className="value">{item.type}</div>
                        </div>
                        <div className="item item-frames">
                            <div className="icon">
                                <div/>
                            </div>
                            <div className="value">{item.stack_count}</div>
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