import cornerstone from 'cornerstone-core';
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from 'cornerstone-math';
import MarkerTool from './MarkerTool';
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawJoinedLines = cornerstoneTools.import('drawing/drawJoinedLines');
const drawTextBox = cornerstoneTools.import('drawing/drawTextBox');
const pointInsideBoundingBox = cornerstoneTools.import('util/pointInsideBoundingBox');
const FreehandMouseTool = cornerstoneTools.FreehandRoiTool;

const style = {
    lineWidth: 1,
    defaultColor: 'white',
    activeColor: 'greenyellow',
    invalidColor: '',
    fillColor: 'transparent',
    truthColour: '#ff1029',
    notCancerColour: '#8CFF29',
    answerColour: 'yellow'
};

export default class MarkerFreehandTool extends FreehandMouseTool{
    constructor() {
        super({name: 'MarkerFreehand'});
    }

    // _pointNearHandle(element, data, coords) {
    //     if (data.handles === undefined || data.handles.points === undefined) return;
    //     if (data.visible === false) return;
    //     for (let i = 0; i < data.handles.points.length; i++) {
    //         const handleCanvas = cornerstone.pixelToCanvas( element, data.handles.points[i] );
    //         if (cornerstoneMath.point.distance(handleCanvas, coords) < 6) return i;
    //     }
    //     // Check to see if mouse in bounding box of textbox
    //     if (data.handles.textBox) {
    //         if (pointInsideBoundingBox(data.handles.textBox, coords)) {
    //             return data.handles.textBox;
    //         }
    //     }
    // }
    //
    // pointNearTool(element, data, coords) {
    //     const validParameters = data && data.handles && data.handles.points;
    //     if (!validParameters) throw new Error( `invalid parameters supplied to tool ${this.name}'s pointNearTool` );
    //     if (!validParameters || data.visible === false)  return false;
    //     const isPointNearTool = this._pointNearHandle(element, data, coords);
    //     if (isPointNearTool !== undefined)  return true;
    //     return false;
    // }

    renderToolData(evt) {
        const eventData = evt.detail;

        // If we have no toolState for this element, return immediately as there is nothing to do
        const toolState = cornerstoneTools.getToolState(evt.currentTarget, this.name);

        if (!toolState) {
            return;
        }

        const { image, element } = eventData;
        const config = this.configuration;
        const seriesModule = cornerstone.metaData.get(
            'generalSeriesModule',
            image.imageId
        );
        const modality = seriesModule ? seriesModule.modality : null;

        // We have tool data for this element - iterate over each one and draw it
        const context = getNewContext(eventData.canvasContext.canvas);
        const lineWidth = style.lineWidth;

        for (let i = 0; i < toolState.data.length; i++) {
            const data = toolState.data[i];

            if (data.visible === false) {
                continue;
            }

            draw(context, context => {
                let color = data.isTruth === undefined ? style.defaultColor :
                    (!data.isTruth ? style.answerColour : (data.isCancerMarker ? style.truthColour : style.notCancerColour));
                let fillColor;

                if (data.active) {
                    if (data.handles.invalidHandlePlacement) {
                        color = config.invalidColor;
                        fillColor = config.invalidColor;
                    } else {
                        // color = data.isTruth === undefined ? style.defaultColor : (data.isTruth ? style.truthColour : style.answerColour);
                        fillColor = style.fillColor;
                    }
                } else {
                    fillColor = style.defaultColor;
                }

                if (data.handles.points.length) {
                    for (let j = 0; j < data.handles.points.length; j++) {
                        const lines = [...data.handles.points[j].lines];
                        const points = data.handles.points;

                        if (j === points.length - 1 && !data.polyBoundingBox) {
                            // If it's still being actively drawn, keep the last line to
                            // The mouse location
                            lines.push(config.mouseLocation.handles.start);
                        }

                        context.save();
                        if(!data.isTruth) {
                            context.setLineDash([5, 5]);
                        }
                        drawJoinedLines(context, element, data.handles.points[j], lines, {
                            color,
                        });
                        context.restore();
                    }
                }

                // Draw handles

                const options = {
                    color,
                    fill: fillColor,
                };

                if (config.alwaysShowHandles || (data.active && data.polyBoundingBox)) {
                    // Render all handles
                    options.handleRadius = config.activeHandleRadius;
                    drawHandles(context, eventData, data.handles.points, options);
                }

                if (data.canComplete) {
                    // Draw large handle at the origin if can complete drawing
                    options.handleRadius = config.completeHandleRadius;
                    const handle = data.handles.points[0];

                    drawHandles(context, eventData, [handle], options);
                }

                if (data.active && !data.polyBoundingBox) {
                    // Draw handle at origin and at mouse if actively drawing
                    options.handleRadius = config.activeHandleRadius;
                    drawHandles(
                        context,
                        eventData,
                        config.mouseLocation.handles,
                        options
                    );

                    const firstHandle = data.handles.points[0];

                    drawHandles(context, eventData, [firstHandle], options);
                }

                // Update textbox stats
                if (data.invalidated === true && !data.active) {
                    if (data.meanStdDev && data.meanStdDevSUV && data.area) {
                        this.throttledUpdateCachedStats(image, element, data);
                    } else {
                        this.updateCachedStats(image, element, data);
                    }
                }

                // let isShowInfo = eventData.element.parentElement.querySelector('.eye').firstElementChild.classList.contains('zmdi-eye');
                let isShowInfo = false;


                // if attempt is screening, don't need to show info
                if(!data.lesionList || Object.keys(data.lesionList)[0] === 'screening') {
                    isShowInfo = false;
                }

                if(isShowInfo && data.polyBoundingBox && data.isTruth !== undefined) {
                    let lesionNames = [];
                    if(data.lesionList !== undefined && data.lesionList !== null && data.lesionList !== {}) {
                        const rootLesion = Object.keys(data.lesionList)[0];
                        if(rootLesion !== undefined) {
                            if(typeof data.lesionList[rootLesion] === "object") {
                                lesionNames.push(rootLesion);
                                Object.keys(data.lesionList[rootLesion]).forEach((key) => {
                                    lesionNames.push(data.lesionList[rootLesion][key]);
                                });
                            } else if(typeof data.lesionList[rootLesion] === "string" && data.lesionList[rootLesion].length > 0) {
                                lesionNames.push(rootLesion);
                                lesionNames.push(data.lesionList[rootLesion]);
                            } else {
                                lesionNames.push(rootLesion);
                            }
                        }
                    }
                    // replace Nil and Present to "No associated features", "Associated features present"
                    lesionNames.forEach((v, i) => {
                        if(v === 'Nil') lesionNames[i] = 'No associated features';
                        if(v === 'Present') lesionNames[i] = 'Associated features present';
                    });

                    // const infoElement = eventData.element.parentElement.querySelector('.overlap-marker-info-list');
                    // if (infoElement) {
                    //     if (data.active) {
                    //         let infoHtml = `<span class="fs-14 b-2"><u>${(data.isTruth ? "Your truth" : "Your answer")}</u></span>`;
                    //         infoHtml += "<span>Rate: 5</span>";
                    //         lesionNames.forEach((v, i) => {
                    //             infoHtml += `<span>${v}</span>`;
                    //         });
                    //         infoElement.innerHTML = infoHtml;
                    //     } else {
                    //         infoElement.innerHTML = "";
                    //         infoElement.style.display = "none";
                    //     }
                    // }

                    let textCoords, padding, colour;
                    if (data.isTruth) {
                        textCoords = cornerstone.pixelToCanvas(eventData.element, {
                            x: data.polyBoundingBox.left + data.polyBoundingBox.width / 2,
                            y: data.polyBoundingBox.top
                        });
                        colour = data.isCancerMarker ? style.truthColour : style.notCancerColour;
                        padding = -15 - (lesionNames.length * 15);
                    }
                    else {
                        textCoords = cornerstone.pixelToCanvas(eventData.element, {
                            x: data.polyBoundingBox.left + data.polyBoundingBox.width / 2,
                            y: data.polyBoundingBox.top + data.polyBoundingBox.height
                        });
                        colour = style.answerColour;
                        padding = 15;
                    }
                    let ratingLabel = data.rating;
                    const ratingLabelObj = MarkerTool.modalityRatings.find((v) => v.value === data.rating);
                    if(ratingLabelObj !== undefined) ratingLabel = ratingLabelObj.label;

                    context.shadowColor = "black";
                    context.shadowOffsetX = 1;
                    context.shadowOffsetY = 1;
                    context.shadowBlur = 1;

                    if ( !data.isTruth ) {
                        drawTextBox(context, 'Your answer. Rate: ' + ratingLabel, textCoords.x, textCoords.y + padding, colour, {fontSize: 100, centering: {x: true, y: true}});
                    } else {
                        drawTextBox(context, 'Lesion Number: ' + data.lesionNumber, textCoords.x, textCoords.y + padding, colour, {centering: {x: true, y: true}});
                    }
                    lesionNames.forEach((v, i) => {
                        drawTextBox(context, v, textCoords.x, textCoords.y + padding + (15 * (i + 1)), colour, {centering: {x: true, y: true}});
                    });
                }
            });
        }
    }
}