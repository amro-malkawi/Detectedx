import React from 'react';
import {Col} from "reactstrap";

export default function({instructionLocale}) {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/img_dbt1.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
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
                <img src={require("Assets/img/instruction/icon_window.png")} className={'mr-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_length.png")} className={'mr-10'} height={40} alt={''}/>To measure the distance between two points, select the length tool, then click on the two points in the image to measure the distance.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_mark_freehand.png")} className={'mr-10'} height={40} alt={''}/>When selected, you can mark a region of interest.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_grid.png")} className={'mr-10'} height={40} alt={''}/>Click on the Grid button to change the screen configuration, please see below for more information.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Screen configuration)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Change the hanging protocol for the case (will also show more options when priors are available)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Invert image.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete all cancer selections.
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Series window <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/></p>
            <div className={'row'}>
                <Col sm={7} className={'right-border'}>
                    <p>
                        Open by default, you can hide by clicking on the series icon.<br/>
                        the images of a case as thumbnails on the right side of the screen.<br/>
                        You can drag images from this window to the main windows allowing you too view extra images on the test/answers windows.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_series.png')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr />
            <p className={'sub-menu-title'}> The Grid</p>
            <div className={'row'}>
                <Col sm={7} className={'right-border'}>
                    <p>
                        Clicking the Grid button will allow you to change the screen configuration, choosing the number of screens on the test page.<br/>
                        Once you have chosen the screen configuration, you can then drag images from the Series window into each screen.
                    </p>
                    <p>
                        <span style={{color: '#42A5F5'}}>Tip:</span>
                        you can <u><b><i>double click</i></b></u> on any view to open it in a single screen, <u><b><i>double click</i></b></u> again to go back to 4 screen configuration.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_grid.jpg')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr />
            <p className={'sub-menu-title'}> Type of test</p>
            <div >
                <img src={require('Assets/img/instruction/img_mammo4.png')} width={'35%'}/>
            </div>
            <hr />
            <div className={'row'}>
                <Col sm={6}>
                    <p className={'sub-menu-title'}>Screening</p>
                    <p>Allows you to choose either:</p>
                    <ul>
                        <li>Recall (BIRADS 0)</li>
                        <li>Next Case (Normal)</li>
                    </ul>
                    <img src={require('Assets/img/instruction/img_mammo5.png')} width={'70%'}/>
                    <p>To add a second lesion, please repeat all the above steps.</p>
                </Col>
                <Col sm={6}>
                    <p className={'sub-menu-title'}>Diagnostic</p>
                    <p>Allows you to assign either:</p>
                    <ul>
                        <li>BIRADS assessment category</li>
                        <p className={'mb-0'}>o 3 – probably benign, 4 – suspicious or 5 – highly suspicious</p>
                        <p>o Abnormality appearances</p>
                        <li>BIRADS assessment category </li>
                        <p className={'mb-0'}>o 2 – benign</p>
                        <p>o Next case ( 1 – normal)</p>
                    </ul>
                    <img src={require('Assets/img/instruction/img_mammo1.png')} width={'70%'}/>
                    <p>For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s). </p>
                    <p>To select a lesion type: <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></p>
                    <p>Other selection boxes will appear depending on your choice. </p>
                    <p>To add a second lesion, please repeat all the above steps.</p>
                </Col>
            </div>
            <hr />

            <p className={'sub-menu-title'}> Marking</p>
            <div>
                <p>Mark either the screening or diagnostic as above by:</p>
                <div>
                    <p> 1. Select the <span style={{color: '#42A5F5'}}>Mark</span> tool </p>
                    <p> 2. Place your mouse pointer over the site you want to mark. </p>
                    <p> 3. <span style={{color: '#42A5F5'}}>Click</span> to mark a lesion </p>
                </div>
            </div>
            <hr/>

            <p>
                Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
            </p>
            <hr/>
            <p className={'sub-menu-title'}> Delete a cancer selection </p>
            <div>
                <p> Move the mouse to the center of the circle or the sides of a freehand selection, the selection will be highlighted, click and a popup window will appear,
                    select <span style={{color: '#42A5F5'}}>Delete</span>
                </p>
                <div className={'d-flex flex-row justify-content-center'}>
                <img src={require('Assets/img/instruction/img_mammo6.png')} width={'20%'} alt={''} style={{margin: 'auto'}}/>
                <img src={require('Assets/img/instruction/img_mammo7.png')} width={'30%'} alt={''} style={{margin: 'auto'}}/>
                </div>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> Normal cases </p>
            <p>
                If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar.
                An unannotated image will be recorded as rating 1 (normal).
            </p>
            <hr/>

            <p>
                Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Submit your answers: </p>
            <p>
                When you reach the last case <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                feedback on your performance.
            </p>
        </div>
    )
}