import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {dropImage, setImageListAction, setShowImageBrowser} from 'Actions';
import { useDrop } from 'react-dnd'
import ImageViewer from "./ImageViewer";

const ImageViewerContainer = (props) => {
    return (
        <div id="images"> {/*className={'cursor-' + this.state.currentTool}>*/}
        {
            props.showImageList.map((id, index) => {
                const [{ canDrop, isOver }, drop] = useDrop({
                    accept: "DicomImage",
                    drop: () => ({ id: id, index }),
                    collect: monitor => ({
                        isOver: monitor.isOver(),
                        canDrop: monitor.canDrop(),
                    }),
                });
                const isDragOverActive = canDrop && isOver;
                const item = props.imageList.find((v) => v.id === id);
                return (
                    <ImageViewer
                        {...props}
                        imageInfo={item}
                        index={index}
                        dndRef={drop}
                        isDragOver={isDragOverActive}
                        key={index + '_' + id}
                    />
                )
            })
        }
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

export default withRouter(connect(mapStateToProps, null)(ImageViewerContainer));