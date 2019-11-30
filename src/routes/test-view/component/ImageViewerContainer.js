import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {dropImage, setImageListAction, setShowImageBrowser} from 'Actions';
import { useDrop } from 'react-dnd'
import ImageViewer from "./ImageViewer";

const ImageViewerContainer = (props) => {
    // {/*<ImageViewer {...props} dndRef={drop} isDragOver={isDragOverActive}/>*/}
    return (
        <div id="images"> {/*className={'cursor-' + this.state.currentTool}>*/}
        {
            props.showImageList.map((item, index) => {
                const [{ canDrop, isOver }, drop] = useDrop({
                    accept: "DicomImage",
                    drop: () => ({ id: item.id, index }),
                    collect: monitor => ({
                        isOver: monitor.isOver(),
                        canDrop: monitor.canDrop(),
                    }),
                });
                const isDragOverActive = canDrop && isOver;
                return (
                    <ImageViewer
                        {...props}
                        imageInfo={item}
                        index={index}
                        dndRef={drop}
                        answers={item.answers}
                        isDragOver={isDragOverActive}
                        key={index}
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
        showImageList: state.testView.showImageList
    };
};

export default withRouter(connect(mapStateToProps, null)(ImageViewerContainer));