import React, {useState, useEffect} from "react";
import {Col} from "reactstrap";

function InstructionWBCTSS() {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/img_wbct1.png")} className={"mt-2 white-border"} width="70%" alt={''}/>
            </p>
            <p>
                <span>Under Tools</span><br/>
                <img src={require("Assets/img/instruction/img_wbct2.png")} className={"white-border"} width="70%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next_previous.png")} className={'me-10'} height={40} alt={''}/>Takes you to the previous/next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'me-10'} height={30} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'me-10'} height={30} alt={''}/>Will take you to the DetectedX’s main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_series.png")} className={'me-10'} height={40} alt={''}/>Will allow you to change between axial, coronal and sagittal series.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'me-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold, then move the mouse to move an image.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'me-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_magnify.png")} className={'me-10'} height={35} alt={''}/>Will allow you to magnify an area of an image.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'me-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_freehand.png")} className={'me-10'} height={40} alt={''}/>When selected, you can draw around a region of interest.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'me-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Images)
            </p>
            <div className={'d-flex flex-row'}>
                <div>
                    <img src={require('Assets/img/instruction/img_grid.jpg')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                </div>
                <div>
                    <p>
                        Clicking the Grid button will allow you to change the screen configuration, choosing the number of screens on the test page.<br/>
                        Once you have chosen the screen configuration, you can then drag images from the Series window into each screen.
                    </p>
                    <p>
                        <span style={{color: '#42A5F5'}}>Tip:</span>
                        you can <u><b><i>double click</i></b></u> on any view to open it in a single screen, <u><b><i>double click</i></b></u> again to go back to 4 screen configuration.
                    </p>
                </div>
            </div>
            <hr/>
            <p className={'sub-menu-title'}> Series window <img src={require("Assets/img/instruction/icon_series.png")} className={'me-10'} height={40} alt={''}/></p>
            <p>
                Opens the images of a case as thumbnails on the right side of the screen.<br/>
                You can drag images from this window to the main windows allowing you too view extra images on the test/answers windows.
            </p>
            <hr/>
            <p className={'sub-menu-title'}> Marking</p>
            <div>
                <p>Mark the bony injuries by:</p>
                <div>
                    <p> 1. Select the <span style={{color: '#42A5F5'}}>Mark</span> tool </p>
                    <p className={'ms-3'}>a. Place your mouse pointer over the site you want to mark.</p>
                    <p className={'ms-3'}>b. <span style={{color: '#42A5F5'}}>Click</span> to mark a lesion.</p>
                    <p> 2. Select the <span style={{color: '#42A5F5'}}>Freehand</span> tool </p>
                    <p className={'ms-3'}>a.click to starting marking, then move the mouse and click around the area of interest.</p>
                    <p className={'ms-3'}>b. to finish, you have to click at the first point you selected.</p>
                    <p>
                        <span style={{color: '#42A5F5'}}>Tip:</span>: IYou MUST mark the injuries on the <strong>Axial</strong> series; the Coronal and Saggital series are provided for supplementary viewing only.
                    </p>
                </div>
            </div>
            <hr/>
            <p className={'sub-menu-title'}> Normal cases </p>
            <p>
                If you think a case is normal, answer the questions on the side and then click  to  <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> move to the next case.
                An unannotated image will be recorded as rating 1 (normal).
            </p>
            <hr/>
            <hr />
            <p className={'sub-menu-title'}>Answering the questions:</p>
            <div className={'row'}>
                <Col sm={7} className={'right-border'}>
                    <p>
                        Just click on the answer you think is correct for each case. Some answers when clicked, will reveal more questions that must be completed also.
                        When the circle or square has been marked, it will go yellow with either a circle or a tick.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_wbct3.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>

            <hr />
            <p className={'sub-menu-title'}> Submit your answers: </p>
            <p>
                When you reach the last case <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                feedback on your performance.
            </p>
            <hr />
            <p className={'sub-menu-title'}> See your answers:  </p>
            <p>There is an option to check through your answers compared with the expert diagnosis. </p>
            <p><img src={require('Assets/img/instruction/img_chest4.png')} width={'50%'} alt={''} style={{margin: 'auto'}}/></p>
        </div>
    )
}

export default InstructionWBCTSS;