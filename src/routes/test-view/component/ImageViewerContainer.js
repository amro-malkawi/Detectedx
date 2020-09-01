import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {dropImage, setImageListAction, setShowImageBrowser} from 'Actions';
import {v4 as uuidv4} from 'uuid';
import {useDrop} from 'react-dnd'
import ImageViewer from "./ImageViewer";


const ImageViewerDropContainer = ({id, rowIndex, colIndex, imageList, param}) => {
    const isBlankBox = id === '';
    id = id === '' ? uuidv4() : id;
    const [{canDrop, isOver}, drop] = useDrop({
        accept: "DicomImage",
        drop: () => ({id, rowIndex, colIndex}),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const isDragOverActive = canDrop && isOver;
    const item = imageList.find((v) => v.id === id);
    return isBlankBox ?
        <div
            className={"image " + (isDragOverActive ? 'drag-hover' : '')}
            ref={drop}
        /> :
        <ImageViewer
            {...param}
            imageInfo={item}
            index={`${rowIndex}_${colIndex}`}
            dndRef={drop}
            isDragOver={isDragOverActive}
        />
};

const ImageViewerContainer = (props) => {
    return (
        <div id="images"> {/*className={'cursor-' + this.state.currentTool}>*/}
            {
                props.showImageList.map((row, rowIndex) => (
                    <div className={'image-row'} key={rowIndex}>
                        {
                            row.map((id, colIndex) => (
                                <ImageViewerDropContainer
                                    id={id}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    imageList={props.imageList}
                                    param={props}
                                    key={`${rowIndex}_${colIndex}_${props.resetId}_${id}`}
                                />
                            ))
                        }
                    </div>
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