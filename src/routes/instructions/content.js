import React, {Component} from 'react';
import {Button, Col} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import LearningCovidModal from "Routes/test/list/LearningCovidModal";
import VideoModal from "Routes/instructions/VideoModal";

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            isShowVideoModal: false,
        }
    }

    renderMammo() {
        return (
            <div>
                <p className={'sub-menu-title'}>The Tools bar</p>
                <p>
                    <img src={require("Assets/img/instruction/toolbar.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>takes you to the next case.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>will take you to the Tests main page.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/>Opens the images of a case as tumbnails on the right side of the screen.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Change the hanging protocol for the case (different views and show priors if available)
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

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <p> 1. Place your mouse pointer over the site you want to mark </p>
                        <p> 2. Double-click to mark a lesion </p>
                        <p> 3. A pop-up menu will appear asking you to rate the lesion: </p>
                        <ul>
                            <li>2 = Benign</li>
                            <li>3 = Equivocal</li>
                            <li>4 = Suspicious</li>
                            <li>5 = Malignant</li>
                        </ul>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this case <span style={{color: '#42A5F5'}}>a positive. i.e. it requires further investigation / assessment.</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p> 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s). </p>
                            <p> To select a lesion type: </p>
                            <ul>
                                <li>click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                                <li>a list of lesion types will appear.</li>
                                <li>Click on lesion type to select it.</li>
                                <li>Other selection boxes will appear depending on your choice.</li>
                            </ul>
                            <p>
                                Tip: If you want to add a second lesion, please repeat all the above steps.
                            </p>
                            <p className={'mt-10'}>
                                Tip: If you want to change the lesion type on a selected lesion, you can click in the centre of the yellow circle and choose another lesion type.
                            </p>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "45px auto 0"}}/>
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "10px auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                    If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                    However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Normal cases </p>
                <p>
                    If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar. An unannotated image will be
                    recorded as rating 1 (normal).
                </p>
                <hr/>

                <p>
                    Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                    If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Submit your answers: </p>
                <p>
                    When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                    feedback on your performance.
                </p>
            </div>
        )
    }

    renderDBT() {
        return (
            <div>
                <p className={'sub-menu-title'}>The Tools bar</p>
                <p>
                    <img src={require("Assets/img/instruction/toolbar.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>takes you to the next case.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>will take you to the Tests main page.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/>Opens the images of a case as tumbnails on the right side of the screen.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Change the hanging protocol for the case (different views and show priors if available)
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

                <p className={'sub-menu-title'}> Slices </p>
                <div className={'row'}>
                    <Col sm={5}>
                        <p> Each breast view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view. </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_brest.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr/>

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7}>
                        <div>
                            <p> 1. Place your mouse pointer over the site you want to mark </p>
                            <p> 2. Double-click to mark a lesion </p>
                            <p> 3. A pop-up menu will appear asking you to rate the lesion: </p>
                            <ul>
                                <li>2 = Benign</li>
                                <li>3 = Equivocal</li>
                                <li>4 = Suspicious</li>
                                <li>5 = Malignant</li>
                            </ul>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this <span style={{color: '#42A5F5'}}>a positive case, i.e. it requires further investigation / assessment.</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7}>
                        <div>
                            <p> 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s). </p>
                            <p> To select a lesion type: </p>
                            <ul>
                                <li>click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                                <li>a list of lesion types will appear.</li>
                                <li>Click on lesion type to select it.</li>
                                <li>Other selection boxes will appear depending on your choice.</li>
                            </ul>
                            <p>
                                Tip: If you want to add a second lesion, please repeat all the above steps.
                            </p>
                            <p className={'mt-10'}>
                                Tip: If you want to change the lesion type on a selected lesion, you can click in the centre of the yellow circle and choose another lesion type.
                            </p>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion1.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                        <img src={require('Assets/img/instruction/img_lesion2.png')} width={'70%'} alt={''} style={{margin: "auto"}} className={'mt-10'}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                    If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                    However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
                </p>
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
                    When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                    feedback on your performance.
                </p>
            </div>
        )
    }

    renderCT() {
        return (
            <div>
                <p className={'sub-menu-title'}>The Tools bar</p>
                <p>
                    <img src={require("Assets/img/instruction/toolbar.png")} className={"mt-20 white-border"} width="100%" alt={''}/>
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>takes you to the next case.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>will take you to the Modules main page.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_series.png")} className={'mr-10'} height={40} alt={''}/>Opens the images of a case as tumbnails on the right side of the screen.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_hanging.png")} className={'mr-10'} height={40} alt={''}/>Change the hanging protocol for the case (different views and show priors if available)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Change contrast/brightness
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete cancer selection
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Slices </p>
                <div className={'row'}>
                    <p> Each breast view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view. </p>
                    <img src={require('Assets/img/instruction/img_ct.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </div>
                <hr/>

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p> 1. Place your mouse pointer over the site you want to mark </p>
                            <p> 2. Double-click to mark a lesion </p>
                            <p> 3. A pop-up menu will appear asking you to rate the lesion: </p>
                            <ul>
                                <li>2 = Benign</li>
                                <li>3 = Equivocal</li>
                                <li>4 = Suspicious</li>
                                <li>5 = Malignant</li>
                            </ul>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr/>
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this <span style={{color: '#42A5F5'}}>a positive case, i.e. it requires further investigation / assessment.</span>
                </p>
                <hr/>

                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p> 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s). </p>
                            <p> To select a lesion type: </p>
                            <ul>
                                <li>click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/></li>
                                <li>a list of lesion types will appear.</li>
                                <li>Click on lesion type to select it.</li>
                                <li>If you want to change the lesion type, then you can click again on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/> and choose another lesion
                                    type.
                                </li>
                            </ul>
                            <p>Tip: If you want to add a second lesion, please repeat all the above steps.</p>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_list_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr/>


                <p className={'sub-menu-title'}> Normal cases </p>
                <p>
                    If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar. An unannotated image will be
                    recorded as rating 1 (normal).
                </p>
                <hr/>

                <p>
                    Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                    If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Submit your answers: </p>
                <p>
                    When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                    feedback on your performance.
                </p>
            </div>
        )
    }


    renderCovid() {
        return (
            <div>
                <p className={'sub-menu-title'}>The Tools bar</p>
                <p>
                    <img src={require("Assets/img/instruction/toolbar_covid.jpg")} className={"mt-20 white-border"} width="100%" alt={''}/>
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_next.png")} className={'mr-10'} height={40} alt={''}/>takes you to the next case.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_instruction.png")} className={'mr-10'} height={40} alt={''}/>Opens this document.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/btn_home.png")} className={'mr-10'} height={40} alt={''}/>will take you to the Tests main page.
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset1.png")} className={'mr-10'} height={40} alt={''}/>Reset case screen settings (Zoom, Window, images)
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Invert image
                </p>
                <hr/>

                <p className={'sub-menu-title'}> Slices </p>
                <div>
                    <p> Each view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices.</p>
                    <img src={require('Assets/img/instruction/img_covid1.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </div>
                <hr/>

                <p className={'sub-menu-title'}> Diagnosing a care </p>
                <div>
                    <p>
                        <span className={'circle-number'}>1</span> You will see a number of cases of Lung CT within this test set, some of these will contain appearances typical of COVID-19, some will not.
                        Your task is to identify on each case if any of the following appearances are present:
                    </p>
                    <ul>
                        <li>Ground glass Opacity;</li>
                        <li>Consolidation;</li>
                        <li>Crazy paving/Mosaic attenuation.</li>
                    </ul>
                </div>
                <div className={'row mt-30'}>
                    <div className={'col-sm-6'}>
                        <p><span className={'circle-number'}>2</span> If you feel any of these appearances are present, you will be asked if this appearance is:</p>
                        <ul>
                            <li>In the upper, lower section of the chest as defined in the diagram below.</li>
                            <li>On the left side, right side or both</li>
                            <li>In the anterior or posterior halves of the chest</li>
                            <li>Whether the <span style={{color: 'red'}}>collective COVID</span> appearances are peripheral, central or both</li>
                        </ul>
                    </div>
                    <div className={'col-sm-6'}>
                        <img src={require('Assets/img/instruction/img_covid.jpg')} width={'90%'} alt={''} className={'ml-10'}/>
                    </div>
                </div>
                <div className={'mt-30'}>
                    <p>
                        <span className={'circle-number'}>3</span> Finally, based on your assessment of the case, you will be asked to give a score of 0-5 indicating whether you think this case is COVID-19 positive or not.
                        This scoring will be defined as:
                    </p>
                    <p className={'ml-30'}> 0: Absolutely confident that this case is not COVID-19 positive </p>
                    <p className={'ml-30'}> 1: Very confident that this case is not COVID-19 positive </p>
                    <p className={'ml-30'}> 2: Quite confident that this case is not COVID-19 positive</p>
                    <p className={'ml-30'}> 3: Quite confident that this case is COVID-19 positive</p>
                    <p className={'ml-30'}> 4: Very confident that this case is COVID-19 positive</p>
                    <p className={'ml-30'}> 5: Absolutely confident that this case is COVID-19 positive</p>
                </div>
                <img src={require('Assets/img/instruction/img_covid2.jpg')} width={'100%'} alt={''} className={'ml-10'}/>
                <hr/>
                <p>
                    Please note, this scoring is based on your confidence that the appearance of COVID-19 is present, not on the severity of the disease.
                </p>
                <hr/>
                <p className={'sub-menu-title'}> Submit your answers: </p>
                <p>
                    When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate
                    feedback on your performance.
                </p>
            </div>
        )
    }

    renderCovid1() {
        return (
            <div>
                <p className={'sub-menu-title'}>Instructions</p>
                <p>
                    Welcome to COVED, a tool aiming to familiarise you with the CT lung appearances typical of COVID-19.
                    You will be asked to look at a number of cases and try to identify appearances where relevant.
                    At the end of this activity, you will have an immediate performance assessment of your abilities to recognise COVID-19 appearances,
                    which is available only to you. You will be given a detailed review comparing your judgements with a panel of expert radiologists.
                </p>
                <hr/>
                <div>
                    <p>
                        You will see 30 cases of Lung CT within this test set, some of these will contain appearances typical of COVID-19, some will not.
                        Your task is to identify on each case if any of the following appearances are present:
                    </p>
                    <ul>
                        <li>Ground glass Opacity;</li>
                        <li>Consolidation;</li>
                        <li>Crazy paving/Mosaic attenuation.</li>
                    </ul>
                </div>
                <hr/>
                <div>
                    <p>
                        If you feel any of these appearances are present, you will be asked if this appearance is:
                    </p>
                    <ul>
                        <li>In the upper, lower section of the chest as defined in the diagram below.</li>
                        <li>On the left side, right side or both</li>
                        <li>In the anterior or posterior halves of the chest</li>
                        <li>Whether the collective COVID appearances are peripheral, central or both</li>
                    </ul>
                    <img src={require('Assets/img/instruction/img_covid.jpg')} width={'30%'} alt={''} style={{marginLeft: 70}}/>
                </div>
                <hr/>
                <div>
                    <p>
                        Finally, based on your assessment of the case, you will be asked to give a score of 0-5 indicating
                        whether you think <strong>this case is</strong> COVID-19 positive <strong><i>or not</i></strong>.
                        This scoring will be defined as:
                    </p>
                    <p>0: Absolutely confident that this case is not COVID-19 positive</p>
                    <p>1: Very confident that this case is not COVID-19 positive</p>
                    <p>2: Quite confident that this case is not COVID-19 positive</p>
                    <p>3: Quite confident that this case is COVID-19 positive</p>
                    <p>4: Very confident that this case is COVID-19 positive</p>
                    <p>5: Absolutely confident that this case is COVID-19 positive</p>
                </div>
                <hr/>
                <p className={'sub-menu-title'}>Please note, this scoring is based on your confidence that the appearance of COVID-19 is present, not on the severity of the disease.</p>
                <p>
                    Immediately after you have finished all cases you will get performance scores based on how your assessment of whether COVID-19 was present compared with the consensus from our expert radiologists.
                    You will then be able to review each case and compare your comments on each cases with those presented by our radiologists.
                </p>
            </div>
        )
    }

    renderContent() {
        const {type} = this.props;
        if (type === 'Mammo') {
            return this.renderMammo();
        } else if (type === 'DBT') {
            return this.renderDBT()
        } else if (type === 'CT') {
            return this.renderCT();
        } else if (type === 'COVID-19') {
            return this.renderCovid();
        } else if (type === 'all') {
            if (this.state.activeIndex === 1) {
                return this.renderMammo();
            } else if (this.state.activeIndex === 2) {
                return this.renderDBT()
            } else if (this.state.activeIndex === 3) {
                return this.renderCT();
            } else if (this.state.activeIndex === 0) {
                return this.renderCovid();
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    rednerInstructionVideo() {
        const {video} = this.props;
        if (video === undefined || video.thumbnail === undefined || video.link === undefined) return null;
        return (
            <div className={'instruction-video'} onClick={() => this.setState({isShowVideoModal: true})}>
                <img src={video.thumbnail} alt=''/>
                <p/>
                <i className="zmdi zmdi-play-circle-outline"/>
            </div>
        )
    }

    render() {
        const {theme, onClose, type, video} = this.props;
        return (
            <div className={theme === 'black' ? 'instruction-theme-black' : 'instruction-theme-white'}>
                <div className={'instruction-container'}>
                    <CustomDialogTitle onClose={onClose}>
                        {
                            type === 'all' ?
                                <AppBar position="static" color="primary" className={'instruction-header'}>
                                    <Tabs value={this.state.activeIndex} onChange={(e, value) => this.setState({activeIndex: value})} textColor={theme === 'black' ? undefined : "primary"}>
                                        <Tab label="COVID-19"/>
                                        <Tab label="Mammo"/>
                                        <Tab label="DBT"/>
                                        <Tab label="CT"/>
                                    </Tabs>
                                </AppBar> :
                                <p className={'fs-23 instruction-title'}>Instructions</p>
                        }
                    </CustomDialogTitle>
                    <DialogContent className={'instruction-content'}>
                        {this.renderContent()}
                        {this.rednerInstructionVideo()}
                    </DialogContent>
                    <DialogActions className={'mt-10'}>
                        <div style={{margin: 'auto'}}>
                            {
                                onClose ? <Button variant="contained" onClick={onClose} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Close&nbsp;&nbsp;</Button> : null
                            }
                        </div>
                    </DialogActions>
                </div>
                <VideoModal
                    open={this.state.isShowVideoModal}
                    onClose={() => this.setState({isShowVideoModal: false})}
                    link={video && video.link}
                />
            </div>
        )
    }
}

const FullDialog = withStyles(theme => ({
    paper: {
        height: '100%',
        maxWidth: 1090
    }
}))(Dialog);