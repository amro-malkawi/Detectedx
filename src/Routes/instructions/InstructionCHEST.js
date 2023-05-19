import React from 'react';
import {Col} from "reactstrap";

export default function({instructionLocale}) {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/img_chest1.png")} className={"mt-20 white-border"} width="70%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next.png")} className={'me-10'} height={40} alt={''}/>Takes you to the next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'me-10'} height={40} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'me-10'} height={40} alt={''}/>Will take you to the Tests main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'me-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold, then move the mouse to move an image.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'me-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'me-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_length.png")} className={'me-10'} height={40} alt={''}/>To measure the distance between two points, select the length tool, then click on the two points in the image to measure the distance.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_grid.png")} className={'me-10'} height={40} alt={''}/>Click on the Grid button to change the screen configuration, please see below for more information.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'me-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Images)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'me-10'} height={40} alt={''}/>Invert image.
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Series window <img src={require("Assets/img/instruction/icon_series.png")} className={'me-10'} height={40} alt={''}/></p>
            <hr />
            <p>
                Opens the images of a case as thumbnails on the right side of the screen.<br/>
                You can drag images from this window to the main windows allowing you too view extra images on the test/answers windows.
            </p>
            <hr/>
            <div className={'row'}>
                <Col sm={3} className={'right-border ps-40'}>
                    <img src={require('Assets/img/instruction/img_chest2.png')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
                <Col sm={9} >
                    <p>
                        Clicking on the case button will reveal a drop-down menu that you can use to quickly compare the current case to each ILO standard case, there are 20 ILO standard cases.<br/>
                        You can also use the space bar to switch between the standard ILO cases.
                    </p>
                </Col>
            </div>

            <hr />
            <p className={'sub-menu-title'}>Answering the questions:</p>
            <div className={'row'}>
                <Col sm={7} className={'right-border'}>
                    <p>
                        Just click on the answer you think is correct for each case. Some answers when clicked, will reveal more questions that must be completed also. <br />
                        When the circle or square has been marked, it will go yellow with either a circle or a tick.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_chest3.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
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