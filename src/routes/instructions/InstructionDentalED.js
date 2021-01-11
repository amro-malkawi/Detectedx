import React from 'react';
import {Col} from "reactstrap";

export default function() {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/toolbar_dentalED.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
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
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'mr-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'mr-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'mr-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold then move the mouse to move an image
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Invert image
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete cancer selection
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Normal cases </p>
            <p>
                If you think a case is normal (i.e. it does not contain an abnormality),
                simply move to the next case by clicking Next on the tool bar. An unannotated image will be recorded as rating 1 (normal).
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Marking an abnormality </p>
            <div className={'row'}>
                <Col sm={12}>
                    <div>
                        <p> 1.	If an abnormality is detected, place your mouse pointer over the site you want to mark. </p>
                        <p> 2.	Double click on your mouse. </p>
                        <p> 3.	A pop-up menu will appear asking you to rate your level of confidence that the marked area contains an abnormality: </p>
                        <div className={'row'}>
                            <Col sm={6}>
                        <ul>
                            <li>2 = lowest confidence</li>
                            <li>3 = medium confidence </li>
                            <li>4 = highest confidence</li>
                        </ul>
                            </Col>
                            <Col sm={6}>
                                <img src={require('Assets/img/instruction/img_dentalED1.png')} width={'50%'} alt={''}/>
                            </Col>
                        </div>
                    </div>
                </Col>
                <Col sm={12}>
                    <div className={'mt-20'}>
                        <p> 4.	After the confidence rating, you will have to select a description that fits the abnormality detected (NB. “description” is used instead of “lesions”). </p>
                        <p> To select an abnormality type:</p>
                        <ul>
                            <li>Click on “Select abnormality type”</li>
                            <li>A list of abnormality types will appear</li>
                            <li>Click on type to select it</li>
                        </ul>
                    </div>
                </Col>
            </div>
            <hr/>
            <p>
                Tip: if you want to change the abnormality type, you can click in the centre of the yellow circle and choose another abnormality type.
            </p>
            <hr/>

            <p className={'sub-menu-title'}> FYI, these are the types: </p>
            <div className={'row'}>
                <Col sm={6}>
                    <ul>
                        <li>Endodontic disease</li>
                        <li>Dental caries</li>
                        <li>Periodontal bone loss </li>
                        <li>Fracture</li>
                        <li>Resorption</li>
                        <li>Other</li>
                    </ul>
                </Col>
                <Col sm={6}>
                    <img src={require('Assets/img/instruction/img_dentalED2.png')} width={'70%'} alt={''}/>
                </Col>
            </div>
            <hr/>

            <p className={'sub-menu-title'}>Delete a selection</p>
            <div className={'row'}>
                <Col sm={7}>
                    <p> Move the mouse to the center of the circle or the sides of a freehand selection. The selection will be highlighted, then click and a pop-up window will appear,
                        select <span style={{color: '#42A5F5'}}>Delete</span>
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_dentalED3.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr/>
            <p>
                Tip: If you want to add a second lesion, please repeat all the above steps.
            </p>
            <p>
                Tip: If you want to change the lesion type on a selected lesion, you can click in the centre of the yellow circle and choose another lesion type.
            </p>

            <hr />
            <p className={'sub-menu-title'}> Submit your answers: </p>
            <p>
                When you reach the last case <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/>, will appear on the tool bar.
                Click to submit your answers and receive immediate feedback on your performance.
            </p>
        </div>
    )
}