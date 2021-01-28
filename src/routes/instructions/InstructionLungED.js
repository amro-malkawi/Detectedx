import React from 'react';
import {Col} from "reactstrap";

export default function() {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/toolbar_lungED.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
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
                <img src={require("Assets/img/instruction/icon_mark.png")} className={'mr-10'} height={40} alt={''}/>When selected, you can mark a region of interest.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_grid.png")} className={'mr-10'} height={40} alt={''}/>Click on the Grid button to change the screen configuration, please see below for more information.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Screen configuration)
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
                        Opens the images of a case as thumbnails on the right side of the screen.<br/>
                        You can drag images from this window to the main windows allowing you too view extra images on the test/answers windows.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_series_lungED.png')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
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
            <p className={'sub-menu-title'}> Slices </p>
            <div className={'row'}>
                <Col sm={12}>
                    <p> Each lung view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view. </p>
                    <img src={require('Assets/img/instruction/img_lungED1.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> Marking a nodule </p>
            <div className={'row'}>
                <Col sm={7}>
                    <div>
                        <p> 1. Select the <span style={{color: '#42A5F5'}}>Mark</span> tool </p>
                        <p> 2. Place your mouse pointer over the site you want to mark. </p>
                        <p> 3. <span style={{color: '#42A5F5'}}>Click</span> to mark a nodule </p>
                    </div>
                </Col>
            </div>
            <div className={'row'}>
                <Col sm={7}>
                    <div>
                        <p> 4. A pop-up menu will appear asking you yo rate the nodule: </p>
                        <ul>
                            <li>
                                1 = Negative
                                <span style={{display: 'block', fontSize: 12}}>No nodules and definitely benign nodules</span>
                            </li>
                            <li>
                                2 = Benign
                                <span style={{display: 'block', fontSize: 12}}>Nodules with a very low likelihood of becoming a clinically active cancer due to size or lack of growth</span>
                            </li>
                            <li>
                                3 = Probably benign
                                <span style={{display: 'block', fontSize: 12}}>Probably benign finding(s) ‐ _short term follow up suggested; includes nodules with a low likelihood of becoming a clinically active cancer</span>
                            </li>
                            <li>
                                4A = Probably suspicious
                                <span style={{display: 'block', fontSize: 12}}>Findings for which additional diagnostic testing is recommended</span>
                            </li>
                            <li>
                                4B/X = Suspicious
                                <span style={{display: 'block', fontSize: 12}}>Findings for which additional diagnostic testing and/or tissue sampling is recommended</span>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_lungED2.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                </Col>
            </div>
            <hr/>

            <div className={'row'}>
                <Col sm={7}>
                    <div>
                        <p> 5. For nodules given ratings of 3 or 4A or 4B/X, you will have to select one or more nodule type(s). </p>
                        <p> To select a nodule type: </p>
                        <ul>
                            <li>click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/> list of nodule types will appear.</li>
                            <li>Click on nodule type to select it.</li>
                        </ul>
                    </div>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_lungED3.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                </Col>
            </div>
            <hr/>
            <p> Tips </p>
            <div>
                <ul>
                    <li>Clicking “Next” without marking on the case will rate it as <span style={{color: '#42A5F5'}}>1 (Negative)</span>.</li>
                    <li>Rating a case 3, 4A, or 4B/X, means you are calling this <span style={{color: '#42A5F5'}}>a positive case,. i.e. it requires further investigation / assessment</span>.</li>
                    <li>To add a second nodule, please repeat all the above step.</li>
                    <li>To change the nodule type on a selected nodule, you can click in the centre of the yellow circle and choose another nodule type.</li>
                </ul>
            </div>
            <hr/>
            <p>
                Tip: If you see the same nodule on more than one view, we recommend that you mark the sites on both views.
                If you correctly locate the nodule on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>nodule sensitivity.</span>
                However, if you correctly mark the nodule on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
            </p>
            <hr/>
            <p className={'sub-menu-title'}> Delete a cancer selection </p>
            <div className={'row'}>
                <Col sm={7}>
                    <p> Move the mouse to the center of the circle or the sides of a freehand selection, the selection will be highlighted, click and a popup window will appear,
                        select <span style={{color: '#42A5F5'}}>Delete</span>
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_lungED4.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> Normal cases </p>
            <p>
                If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar.
                An unannotated image will be recorded as rating 1 (normal).
            </p>
            <hr/>

            <p>
                Tip: A case with nodule rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                If the case does contain a malignant nodule which you rated as 2 (benign), your nodule sensitivity will be adversely affected.
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