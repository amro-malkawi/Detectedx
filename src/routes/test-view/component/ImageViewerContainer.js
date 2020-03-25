import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {dropImage, setImageListAction, setShowImageBrowser} from 'Actions';
import { useDrop } from 'react-dnd'
import ImageViewer from "./ImageViewer";


const ImageViewerDropContainer = ({id, index, imageList, param}) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: "DicomImage",
        drop: () => ({ id: id, index }),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const isDragOverActive = canDrop && isOver;
    const item = imageList.find((v) => v.id === id);
    return (
        <ImageViewer
            {...param}
            imageInfo={item}
            index={index}
            dndRef={drop}
            isDragOver={isDragOverActive}
        />
    )
};

const ImageViewerContainer = (props) => {
    return (
        <div id="images"> {/*className={'cursor-' + this.state.currentTool}>*/}
            {
                props.showImageList.map((id, index) => (
                    <ImageViewerDropContainer
                        id={id}
                        index={index}
                        imageList={props.imageList}
                        param={props}
                        key={index + '_' + props.resetId + '_' + id}
                    />
                ))
            }
        </div>
    )
};

// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        showImageList: state.testView.showImageList,
        resetId: state.testView.resetId,
    };
};

export default withRouter(connect(mapStateToProps, null)(ImageViewerContainer));