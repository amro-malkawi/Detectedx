import React, {useState, Component} from 'react';
import {IconButton} from "@mui/material";
import {ChildButton, FloatingMenu} from "Components/FloatingMenu";
import cornerstoneTools from "cornerstone-tools";
import {connect, useSelector} from "react-redux";

const stackToIndex = cornerstoneTools.import('util/scrollToIndex');

export const adjustSlideSize = () => {
    let sliders = document.querySelectorAll('div .stack-scrollbar input');
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
    }
}

const ImageScrollBar = ({imageId, imageElement}) => {
    const imageList = useSelector((state) => state.testView.imageList);
    const [isShowFloatingMenu, setIsShowFloatingMenu] = useState(false);

    function onStepSlide(seek) {
        const stackState = cornerstoneTools.getToolState(imageElement, 'stack');
        if(stackState === undefined || stackState.data === undefined || stackState.data.length === 0) return;
        const currentStackIndex = stackState.data[0].currentImageIdIndex;
        const imageLength = stackState.data[0].imageIds.length;

        let value = currentStackIndex + 1 + seek;
        if (value > imageLength || value < 1) return;
        setStack(value);
    }

    function onStackSlide(event) {
        setStack(Number(event.target.value));
    }

    function setStack(value) {
        const newIndex = Number(value) - 1;
        let stackToolDataSource = cornerstoneTools.getToolState(imageElement, 'stack');
        if (stackToolDataSource === undefined) {
            return;
        }
        let stackData = stackToolDataSource.data[0];
        // Switch images, if necessary
        if (newIndex !== stackData.currentImageIdIndex && stackData.imageIds[newIndex] !== undefined) {
            stackToIndex(imageElement, newIndex);
            stackData.currentImageIdIndex = newIndex;
        }
    }

    const stackState = cornerstoneTools.getToolState(imageElement, 'stack');
    if (stackState === undefined || stackState.data === undefined || stackState.data.length === 0) {
        return null;
    } else {
        let countPerStack = {};
        const currentStackIndex = stackState.data[0].currentImageIdIndex;
        const imageLength = stackState.data[0].imageIds.length;

        let markList = [];
        const imageInfo = imageList.find((v) => v.id === imageId);
        if(imageInfo !== undefined && imageInfo.answers.markList !== undefined) {
            markList = imageInfo.answers.markList;
        }

        markList.forEach((v) => {
            if (countPerStack[v.stack] === undefined) {
                countPerStack[v.stack] = {answerCount: 0, truthCount: 0};
            }
            if (v.isTruth) {
                countPerStack[v.stack].truthCount++;
            } else {
                countPerStack[v.stack].answerCount++;
            }
        });
        let floatingButton = [];
        for (let v in countPerStack) {
            floatingButton.push({
                stack: v,
                answerCount: countPerStack[v].answerCount,
                truthCount: countPerStack[v].truthCount,
            });
        }


        return (
            <div>
                <div className={'side-bar'}>
                    <IconButton className={'change-btn'} onClick={() => onStepSlide(-1)}>
                        <i className="zmdi zmdi-minus"/>
                    </IconButton>
                    <div className="stack-scrollbar">
                        <input data-cy="stack-scrollbar-range" type="range" min={1} max={imageLength} value={currentStackIndex + 1} onChange={onStackSlide}/>
                    </div>
                    <IconButton className={'change-btn'} onClick={() => onStepSlide(1)}>
                        <i className="zmdi zmdi-plus"/>
                    </IconButton>
                </div>
                <div className="slice status">Slice: [{currentStackIndex + 1}/{imageLength}]</div>
                {
                    floatingButton.length > 0 ?
                        <div className={'floating-menu'}>
                            <FloatingMenu
                                slideSpeed={500}
                                direction={'down'}
                                isOpen={isShowFloatingMenu}
                                spacing={8}
                                onClose={() => setIsShowFloatingMenu(!isShowFloatingMenu)}
                                isScroll={floatingButton.length > 10}
                                itemContainerClass={'floating-item-content'}
                            >
                                {
                                    floatingButton.map((v, i) =>
                                        <ChildButton
                                            key={i}
                                            answerCount={v.answerCount}
                                            truthCount={v.truthCount}
                                            label={'Slice ' + (Number(v.stack) + 1)}
                                            buttonTooltip={''}
                                            active={currentStackIndex === Number(v.stack)}
                                            size={40}
                                            onClick={() => setStack(Number(v.stack) + 1)}
                                        />
                                    )
                                }
                            </FloatingMenu>
                        </div> : null
                }
            </div>
        )
    }
}

export default ImageScrollBar;

