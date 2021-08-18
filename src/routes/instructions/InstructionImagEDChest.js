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
                <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>Takes you to the next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>Will take you to the Tests main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'mr-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold, then move the mouse to move an image.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'mr-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'mr-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_length.png")} className={'mr-10'} height={40} alt={''}/>To measure the distance between two points, select the length tool, then click on the two points in the image to measure the distance.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_ellipse.png")} className={'mr-10'} height={40} alt={''}/>To create an oval or circle to assist in measuring, select the ellipse tool,
                then click on the image and drag until the shape is your desired size.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_erase.png")} className={'mr-10'} height={40} alt={''}/>The erase tool can get rid of any markings on the image by selecting the erase tool and clicking on the markings you wish to delete.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Images)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Invert image.
            </p>
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
                    <img src={require('Assets/img/instruction/img_imagedchest1.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
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