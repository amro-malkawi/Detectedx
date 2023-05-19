import React, {useEffect} from 'react';
import withRouter from 'Components/WithRouter';
import {connect, useSelector} from "react-redux";
import {v4 as uuidv4} from 'uuid';
import {useDrop} from 'react-dnd'
import { ContextMenuTrigger } from "react-contextmenu";
import ImageViewer from "./ImageViewer";
import TestViewContextMenu from "./TestViewToolList/TestViewContextMenu";


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
    const testViewState = useSelector((state) => state.testView);
    const noSynchronizerProps = {...props};
    noSynchronizerProps.synchronizer = undefined;
    const fullImageViewerRow = Number(testViewState.fullImageViewerIndex.toString().split('_')[0]);

    useEffect(() => {
    }, []);

    return (
        <div className={'image-container'}>
            {testViewState.volparaImageId &&
                <div id="images">
                    <div className={'image-row'}>
                        <ImageViewerDropContainer
                            id={testViewState.volparaImageId}
                            rowIndex={-1}
                            colIndex={-1}
                            imageList={testViewState.imageList}
                            param={noSynchronizerProps}
                            key={`${0}_${0}_${testViewState.resetId}_${testViewState.volparaImageId}`}
                        />
                    </div>
                </div>
            }
            {/*<div id="images"> /!*className={'cursor-' + this.state.currentTool}>*!/*/}
            <ContextMenuTrigger id={'images'} renderTag='div' attributes={{id: 'images'}} holdToDisplay={-1}>
                {
                    testViewState.showImageList.map((row, rowIndex) => (
                        <div className={'image-row'} key={rowIndex}
                             style={(fullImageViewerRow !== -1 && fullImageViewerRow !== rowIndex) ? {display: 'none'} : {}}
                        >
                            {
                                row.map((id, colIndex) => (
                                    <ImageViewerDropContainer
                                        id={id}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        imageList={testViewState.imageList}
                                        param={props}
                                        key={`${rowIndex}_${colIndex}_${testViewState.resetId}_${id}`}
                                    />
                                ))
                            }
                        </div>
                    ))
                }
            </ContextMenuTrigger>
            {/*</div>*/}
            <TestViewContextMenu
                toolList={testViewState.toolList}
                complete={props.complete}
            />
        </div>
    )
}

export default ImageViewerContainer;


// const ImageViewerContainer = (props) => {
//     const noSynchronizerProps = {...props};
//     noSynchronizerProps.synchronizer = undefined;
//     const focusImageViewerRow = Number(props.fullImageViewerIndex.toString().split('_')[0]);
//     return (
//         <div className={'image-container'}>
//             {props.volparaImageId &&
//                 <div id="images">
//                     <div className={'image-row'}>
//                     <ImageViewerDropContainer
//                         id={props.volparaImageId}
//                         rowIndex={-1}
//                         colIndex={-1}
//                         imageList={props.imageList}
//                         param={noSynchronizerProps}
//                         key={`${0}_${0}_${props.resetId}_${props.volparaImageId}`}
//                     />
//                     </div>
//                 </div>
//             }
//             {/*<div id="images"> /!*className={'cursor-' + this.state.currentTool}>*!/*/}
//             <ContextMenuTrigger id={'images'} renderTag='div' attributes={{id: 'images'}} holdToDisplay={-1}>
//                 {
//                     props.showImageList.map((row, rowIndex) => (
//                         <div className={'image-row'} key={rowIndex}
//                              style={(focusImageViewerRow !== -1 && focusImageViewerRow !== rowIndex) ? {display: 'none'} : {}}
//                         >
//                             {
//                                 row.map((id, colIndex) => (
//                                     <ImageViewerDropContainer
//                                         id={id}
//                                         rowIndex={rowIndex}
//                                         colIndex={colIndex}
//                                         imageList={props.imageList}
//                                         param={props}
//                                         key={`${rowIndex}_${colIndex}_${props.resetId}_${id}`}
//                                     />
//                                 ))
//                             }
//                         </div>
//                     ))
//                 }
//             </ContextMenuTrigger>
//             {/*</div>*/}
//             <TestViewContextMenu
//                 toolList={props.toolList}
//                 complete={props.complete}
//             />
//         </div>
//     )
// };
//
// // map state to props
// const mapStateToProps = (state) => {
//     return {
//         imageList: state.testView.imageList,
//         showImageList: state.testView.showImageList,
//         volparaImageId: state.testView.volparaImageId,
//         resetId: state.testView.resetId,
//         toolList:state.testView.toolList,
//         currentTool: state.testView.currentTool,
//         fullImageViewerIndex: state.testView.fullImageViewerIndex,
//     };
// };
//
// // export default withRouter(connect(mapStateToProps, null)(ImageViewerContainer));