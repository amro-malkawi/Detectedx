import React, {useState, Component} from 'react';
import {IconButton} from "@material-ui/core";
import IntlMessages from "Util/IntlMessages";
import {ChildButton, FloatingMenu} from "Components/FloatingMenu";
import cornerstoneTools from "cornerstone-tools";
import {connect, useSelector} from "react-redux";

const stackToIndex = cornerstoneTools.import('util/scrollToIndex');

export const adjustSlideSize = () => {
    let sliders = document.querySelectorAll('div .stack-scrollbar input');
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
    }
    // window.addEventListener('resize', () => {
    //     console.log('resize----------------------')
    //     let sliders = document.querySelectorAll('div .stack-scrollbar input');
    //     for (let i = 0; i < sliders.length; i++) {
    //         sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
    //     }
    // });
}

/*
class ImageScrollBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowFloatingMenu: false
        }
    }

    componentDidMount() {

    }

    onStepSlide(seek) {
        const stackState = cornerstoneTools.getToolState(this.props.imageElement, 'stack');
        if(stackState === undefined || stackState.data === undefined || stackState.data.length === 0) return;
        const currentStackIndex = stackState.data[0].currentImageIdIndex;
        const imageLength = stackState.data[0].imageIds.length;

        let value = currentStackIndex + 1 + seek;
        if (value > imageLength || value < 1) return;
        this.setStack(value);
    }

    onStackSlide(event) {
        this.setStack(Number(event.target.value));
    }

    setStack(value) {
        const newIndex = Number(value) - 1;
        let stackToolDataSource = cornerstoneTools.getToolState(this.props.imageElement, 'stack');
        if (stackToolDataSource === undefined) {
            return;
        }
        let stackData = stackToolDataSource.data[0];
        // Switch images, if necessary
        if (newIndex !== stackData.currentImageIdIndex && stackData.imageIds[newIndex] !== undefined) {
            stackToIndex(this.props.imageElement, newIndex);
            stackData.currentImageIdIndex = newIndex;
        }
    }

    render() {
        const stackState = cornerstoneTools.getToolState(this.props.imageElement, 'stack');
        console.log('dkdkdkdkdkdd', this.props.imageId, this.props.imageElement, stackState)
        if (stackState === undefined || stackState.data === undefined || stackState.data.length === 0) {
            return null;
        } else {
            let countPerStack = {};
            const currentStackIndex = stackState.data[0].currentImageIdIndex;
            const imageLength = stackState.data[0].imageIds.length;

            // const imageInfo = imageList.find((v) => v.id === imageId);
            // console.log(imageInfo)
            const markList = [];
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
                        <IconButton className={'change-btn'} onClick={() => this.onStepSlide(-1)}>
                            <i className="zmdi zmdi-minus"/>
                        </IconButton>
                        <div className="stack-scrollbar">
                            <input type="range" min={1} max={imageLength} value={currentStackIndex + 1} onChange={this.onStackSlide.bind(this)}/>
                        </div>
                        <IconButton className={'change-btn'} onClick={() => this.onStepSlide(1)}>
                            <i className="zmdi zmdi-plus"/>
                        </IconButton>
                    </div>
                    <div className="slice status"><IntlMessages id={"testView.viewer.slice"}/>: [{currentStackIndex + 1}/{imageLength}]</div>
                    {
                        floatingButton.length > 0 ?
                            <div className={'floating-menu'}>
                                <FloatingMenu
                                    slideSpeed={500}
                                    direction={'down'}
                                    isOpen={this.state.isShowFloatingMenu}
                                    spacing={8}
                                    onClose={() => this.setState({isShowFloatingMenu: !this.state.isShowFloatingMenu})}
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
                                                onClick={() => this.setStack(Number(v.stack) + 1)}
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
}


const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
    };
};

export default connect(mapStateToProps)(ImageScrollBar);*/

const ImageScrollBar = ({imageId, imageElement, imageList}) => {
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
        const imageList = useSelector((state) => state.testView.imageList);
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
                <div className="slice status"><IntlMessages id={"testView.viewer.slice"}/>: [{currentStackIndex + 1}/{imageLength}]</div>
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

