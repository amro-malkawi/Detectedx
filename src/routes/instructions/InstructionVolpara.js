import React from 'react';
import {Col} from "reactstrap";

export default function () {
    return (
        <div>
            <ul style={{marginTop: -12, marginLeft: -17}}>
                <li>
                    In each of the following 60 cases,
                    you will visually assess breast density and select the breast composition category (a, b, c, or d) according to BI-RADS® Atlas 5th Edition guidelines.
                </li>
                <li>
                    Once you’ve assessed all cases, you’ll be shown your agreement scores.
                    The three agreement scores compare your assessment with Volpara® Density Grade™, other radiologists in the same region, and radiologists globally.
                </li>
                <li>
                    Each case will then be viewed again alongside a Volpara Scorecard and commentary from our Clinical Team.
                </li>
            </ul>
            <p className={'sub-menu-title'}>The Tools bar</p>
            <p>
                <img src={require("Assets/img/instruction/toolbar_volpara.jpg")} className={"mt-20 white-border"} width="100%" alt={''}/>
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_next.png")} className={'me-10'} height={40} alt={''}/>Takes you to the next case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_previous.png")} className={'me-10'} height={40} alt={''}/>Takes your to the previous case.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_instruction.png")} className={'me-10'} height={40} alt={''}/>Opens this document.
            </p>
            <p>
                <img src={require("Assets/img/instruction/btn_home.png")} className={'me-10'} height={40} alt={''}/>will take you to the Tests main page.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_zoom.png")} className={'me-10'} height={40} alt={''}/>Will allow you to zoom in and out of an image, user mouse scroll to zoom.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_window.png")} className={'me-10'} height={40} alt={''}/>Changes contrast and brightness for an image, click and drag left/right for
                contrast or up/down for brightness.
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_pan.png")} className={'me-10'} height={40} alt={''}/>When selected, you can use the mouse to click and hold then move the mouse to move
                an image
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_reset.png")} className={'me-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, Images),
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_hanging.png")} className={'me-10'} height={40} alt={''}/>Change the hanging protocol for the case (different views and show priors if
                available)
            </p>
            <p>
                <img src={require("Assets/img/instruction/icon_cb.png")} className={'me-10'} height={40} alt={''}/>Invert image
            </p>
            <hr/>

            <p className={'sub-menu-title'}> To select breast density category </p>
            <div className={'row'}>
                <Col sm={6} className={'right-border'}>
                    <ul>
                        <li>Click on <img src={require("Assets/img/instruction/icon_density.png")} className={'me-10'} height={40} alt={''}/></li>
                        <li>Select the breast density category from the popup window</li>
                    </ul>
                </Col>
                <Col sm={6}>
                    <img src={require('Assets/img/instruction/volpara_1.png')} width={'90%'} alt={''} style={{margin: '40px auto 0px'}}/>
                </Col>
            </div>
            <hr/>
            <p className={'sub-menu-title'}> Clinical commentary</p>
            <div className={'row'}>
                <Col sm={12}>
                    <p>Commentary on each case highlights factors such as the following that may impact the Volpara Density Grade:</p>
                    <ul>
                        <li>
                            <strong>Breast volume.</strong> Small- (&lt;500cm3) and large-volume (&gt;1000cm3) breasts may impact the visual assessment of breast tissue composition.
                            It can be difficult to accurately judge volumes of fatty and fibroglandular tissue visually.
                            Very small and very large breasts may result in a higher or lower than expected breast density, respectively.
                        </li>
                        <li>
                            <strong>Close to a Volpara Density Grade threshold.</strong> BI-RADS® 5th Edition acknowledges the considerable intra-and inter-observer variation in visually estimating
                            breast density between any two adjacent composition categories.
                        </li>
                        <li>
                            <strong>Asymmetrical breast density assessment.</strong> According to BI-RADS® 5th Edition guidelines, if the breasts are not of apparently equal density,
                            the denser breast should be used to categorize breast density.
                        </li>
                    </ul>
                </Col>
            </div>
            <hr/>
            <p className={'sub-menu-title'}> VolparaScorecard+ </p>
            <div className={'row'}>
                <Col sm={12}>
                    <ul>
                        <li>VolparaScorecard+ is used by radiologists to provide a consistent assessment of volumetric breast density. </li>
                        <li>The Volpara Density Grade correlates with the BI-RADS® 5th Edition categories.</li>
                        <li>The volumetric breast density percentage (VBD%) of each breast is displayed on the Volpara Scorecard and provides information to support your density grade decision.</li>
                    </ul>
                </Col>
            </div>
            <hr/>

            <p className={'sub-menu-title'}> BI-RADS® Atlas 5th Edition  </p>
            <p>Mammography breast composition categories</p>
            <div className={'row'}>
                <Col sm={6} className={'right-border'}>
                    <img src={require('Assets/img/instruction/volprara_2.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    <p style={{fontSize: 13, fontStyle: 'italic', margin: '0 auto', paddingTop: 10}}>Figure 1: BI-RADS Atlas 5th Edition breast composition categories</p>
                </Col>
                <Col sm={6}>
                    <div>
                        <p> a. The breasts are almost entirely fatty </p>
                        <p> b. There are scattered areas of fibroglandular density </p>
                        <p> c. The breasts are heterogeneously dense, which may obscure small masses </p>
                        <p> d. The breasts are extremely dense, which lowers the sensitivity of mammography</p>
                    </div>
                </Col>
            </div>
            <hr/>
            <p>
                Each of these descriptions “is an overall assessment of the volume of attenuating tissues in the breast, to help indicate the relative possibility
                that a lesion could be obscured by normal tissue and that the sensitivity of examination thereby may be compromised by dense breast tissue” (ACR BI RADS® Atlas 5th Edition, p. 123).
            </p>
        </div>
    )
}