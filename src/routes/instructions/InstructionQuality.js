import React from 'react';
import {Col} from "reactstrap";

export default function({instructionLocale}) {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/toolbar_quality.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next_previous.png")} className={'mr-10'} height={40} alt={''}/>Takes you to the previous/next case.
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
                <img src={require("Assets/img/instruction/icon_window.png")} className={'mr-10'} height={40} alt={''}/>Window can make you change the brightness by dragging up and down, and can make you change the contrast by dragging left to right on a breast.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_length.png")} className={'mr-10'} height={40} alt={''}/>Length allows you to measure from one place to another with a straight line.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_angle.png")} className={'mr-10'} height={40} alt={''}/>Angle allows you to create an angle on the breast by clicking and then clicking in a second position.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_ellipse.png")} className={'mr-10'} height={40} alt={''}/>Ellipse allows you to click and drag a circle to your desired size on each breast.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_rectangle.png")} className={'mr-10'} height={40} alt={''}/>Rectangle allows you to measure the breast in a rectangle shape when you click and drag to your desired size.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_arrow.png")} className={'mr-10'} height={40} alt={''}/>Arrow allows you to point at a certain place and then place an annotation.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_erase.png")} className={'mr-10'} height={40} alt={''}/>Erase allows you to delete all the measurements you have made using the rectangle, length, angle and ellipse tool.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, screen configuration).
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Change the hanging protocol for the case so you can view both the left CC and right CC and the left MLO and right MLO.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Invert image.
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Rating the breasts </p>
            <div>
                <p><strong>Score:</strong></p>
                <p>
                    1 = Does not meet criteria<br/>
                    2 =Almost meets criteria<br/>
                    3 =Definitely meets criteria
                </p>
                <div>
                    <p><strong>Instructions:</strong></p>
                    <p className={'ml-40'}>
                        1.	Please give a score (1,2 or 3) to each of the following Right MLO features.<br/>
                        2.	Repeat for Left MLO, Right CC and Left CC<br/>
                        3.	Please score (1, 2 or 3) the 2 MLO views for overall symmetry<br/>
                        4.	Repeat for the 2 CC views
                    </p>
                </div>
            </div>
            <hr />
            <p className={'sub-menu-title'}> Diagram</p>
            <div className={'row'}>
                <Col sm={5} className={'right-border'}>
                    <img src={require('Assets/img/instruction/img_quality1.png')} width={'90%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
                <Col sm={7}>
                    <p>
                        The posterior nipple line, PNL, is a line drawn posteriorly and perpendicularly from the nipple to the edge of the image on the CC view or to a line drawn along the margin of the pectoral muscle on the MLO view.
                    </p>
                </Col>
            </div>
            <hr />
            <p className={'sub-menu-title'}> Changing your selection</p>
            <div>
                <p>If you wish to change your selection then just choose the different rating by clicking on it. </p>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> Submit your answers: </p>
            <p>
                When you reach the last case <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                feedback on your performance.
            </p>
        </div>
    )
}