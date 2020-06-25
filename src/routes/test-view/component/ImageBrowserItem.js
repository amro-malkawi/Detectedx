import React from 'react';
import { useDrag } from 'react-dnd'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {dropImage} from "Actions";
import * as Apis from 'Api';
import IntlMessages from "Util/IntlMessages";

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
    const metaData = JSON.parse(item.metadata);
    return (
        <div className="ThumbnailEntryContainer">
            <div ref={drag} className="ThumbnailEntry">
                <div className="p-x-1">
                    <div className="ImageThumbnail" style={{boxShadow: 'inset 0 0 0 1px ' + (item.type === 'test' ? '#72787d' : (item.type === 'prior' ? '#73730a' : '#672525'))}}>
                        <div className="image-thumbnail-canvas">
                            <img
                                className="static-image"
                                src={item.image_thumbnail}
                                height={123}
                                crossOrigin={'anonymous'}
                                alt={''}
                            />
                        </div>
                        <div className="image-thumbnail-progress-bar">
                            <div className="image-thumbnail-progress-bar-inner" style={{width: 0}}/>
                        </div>
                    </div>
                </div>
                <div className="series-details">
                    <div className="series-description">{metaData.viewPosition ? metaData.viewPosition : ''}</div>
                    <div className="series-information">
                        <div className="item item-series">
                            <div className="icon"><IntlMessages id={"testView.browser.laterality"}/></div>
                            <div className="value">{metaData.imageLaterality ? metaData.imageLaterality : ''}</div>
                        </div>
                        <div className="item item-series">
                            <div className="icon"><IntlMessages id={"testView.browser.type"}/></div>
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