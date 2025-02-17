import React from 'react';
import {Col} from "reactstrap";

export default function() {
    return (
        <div>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/pct_toolbar.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
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
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'me-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'me-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'me-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold then move the mouse to move an image
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_length.png")} className={'me-10'} height={40} alt={''}/>To measure the distance between two points, select the length tool, then click on the two points in the image to measure the distance.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_grid.png")} className={'me-10'} height={40} alt={''}/>Click on the Grid button to change the screen configuration, please see below for more information.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_series.png")} className={'me-10'} height={40} alt={''}/>Opens the images of a case as thumbnails on the right side of the screen.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'me-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Images)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_eye.png")} className={'me-10'} height={40} alt={''}/>View/hide cancer selection information
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'me-10'} height={40} alt={''}/>Invert image
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_recyle.png")} className={'me-10'} height={40} alt={''}/>Delete selection
            </p>
            <hr/>

            <p className={'sub-menu-title'}> Slices </p>
            <div className={'row'}>
                <Col sm={7} className={'right-border'}>
                    <p>
                        Each breast view has a slide bar to help you navigate through the image slices.
                        Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/pct_1.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr />
            <p className={'sub-menu-title'}> Series window <img src={require("Assets/img/instruction/icon_series.png")} className={'me-10'} height={40} alt={''}/></p>
            <div className={'row'}>
                <Col sm={7} className={'right-border'}>
                    <p>
                        Opens the images of a case as thumbnails on the right side of the screen.
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
                        you can <u><b><i>double click</i></b></u> on any view to open it in a single screen, <u><b><i>double click</i></b></u> again to go back to original screen configuration.
                    </p>
                </Col>
                <Col sm={5}>
                    <img src={require('Assets/img/instruction/img_grid.jpg')} width={'50%'} alt={''} style={{margin: 'auto'}}/>
                </Col>
            </div>
            <hr />
            <p className={'sub-menu-title'}> Submit your answers: </p>
            <p>
                When you reach the last case <img src={require('Assets/img/instruction/btn_submit.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                feedback on your performance.
            </p>
        </div>
    )
}