import React, {Component} from 'react';
import {Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab, TabPanel, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

export default class InstructionModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
    }

    renderOld() {
        return (
            <div>
                <div>
                    <p style={{fontWeight: 'bold', color: '#42A5F5'}}> Viewing the mammograms </p>
                    <p > To complete this test set, you will need access to a mammography workstation with the test sets (DICOM images) imported to your PACS. </p>
                    <p > You should be viewing the cases in DICOM format on your mammography workstation (see ‘A’ below) and marking the cases on this scoring software (see ‘B’ below), to do this: </p>
                    <ul >
                        <li > First select the test set in the ‘My Test sets’ tab on this website. </li>
                        <li > Then open the same test set from your PACS and display the first case. </li>
                    </ul>
                    <p className={'text-center'}>
                        <img height="300" src={require("Assets/img/instruction/Zoey.jpg")} className={"mt-20"} width="450" alt={''}/>
                    </p>
                    <p style={{fontWeight: 'bold', color: '#42A5F5'}}> Navigation tools </p>
                    <p > There are useful tools to help you navigate the test set. These can be found on the tool bar and the top left and right side of the screen. </p>
                    <p >
                        <img src={require("Assets/img/instruction/header.png")} className={"mt-20"} width="1000" alt={''}/>
                    </p>
                    <p ><strong >Home</strong> tab will take you to the Information page </p>
                    <p ><strong >Instructions</strong>tab will take you to this page </p>
                    <p  ><strong >Show Controls </strong>allows you to show/hide tools and is on by default </p>
                    <p  ><strong >Background Loading </strong>allows you to load the succeeding cases as you view the current case. It is off by default </p>
                    <p  ><strong >Previous</strong> and <strong >Next </strong> buttons allow you to move forward and back through the set. Beside these is a drop-down menu showing the list of cases in this set. It allows you to jump to a specific case </p>
                    <p  ><strong >Brightness, Contrast</strong> and <strong >Invert </strong>functions are available to you </p>
                    <p style={{fontWeight: 'bold', color: '#42A5F5'}}> Icons </p>
                    <p  >
                        <img height="50" src={require("Assets/img/instruction/2.png")} width="50" alt={''}/> Click to show or hide the rating and location that you marked for a lesion
                    </p>
                    <p >
                        <img height="50" src={require("Assets/img/instruction/3.png")} width="50" alt={''}/>  Click to reset Brightness, Contrast, and Invert tools to original presentation
                    </p>
                    <p  >
                        <img height="50" src={require("Assets/img/instruction/4.png")} width="50" alt={''}/>  Click to delete all lesions you’ve marked on the case
                    </p>
                    <p style={{fontWeight: 'bold', color: '#42A5F5'}}> How to mark a lesion </p>
                    <p  > 1. Place your mouse pointer over the site you want to mark </p>
                    <p  > 2. Double-click to mark a lesion </p>
                    <p  > 3. A pop-up menu will appear asking you to rate the lesion with one of the following: </p>
                    <ul  >
                        <li >2 = Benign</li>
                        <li >3 = Equivocal</li>
                        <li >4 = Suspicious</li>
                        <li >5 = Malignant</li>
                    </ul>
                    <p ><strong >Tip:</strong> Rating a case 3, 4, or 5, means you are calling this case <strong >positive</strong>. </p>
                    <p > 4. For lesions given ratings of 3 or 4 or 5, a pop-up menu will appear asking to select one or more lesion type(s). Click OK to continue. </p>
                    <p ><strong >Tip:</strong> If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views. If you correctly locate the lesion on just 1 view, you will still get full points for lesion sensitivity. However, if you correctly mark the lesions on two views, you will get full points for location sensitivity, which is calculated for your JAFROC score. </p>
                    <p style={{fontWeight: 'bold', color: '#42A5F5'}}> How to rate a normal case </p>
                    <p > If you think a case is normal, simply move to the next case by clicking the “Next” button on the tool bar. An unannotated image will be recorded as rating 1 (normal). </p>
                    <p ><strong >Tip:</strong> A case with lesions rating 2 (benign) is considered a normal case however you will be asked to locate a site. If the case does contain a true malignant lesion but you rated it as 2 (benign), your lesion sensitivity will be affected. </p>
                    <p > You may see widespread calcifications on the mammograms, please only locate abnormal lesions. </p>
                    <p style={{fontWeight: 'bold', color: '#42A5F5'}}> Finished? </p>
                    <p > When you reach the last case, the Complete button will appear on the tool bar. Click to submit your answers and receive immediate feedback on your performance. </p>
                </div>
            </div>
        )
    }

    renderMammo() {
        return (
                <div>
                    <p className={'sub-menu-title'}>The Tools bar</p>
                    <p >
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
                        <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information
                    </p>
                    <p>
                        <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset image
                    </p>
                    <p>
                        <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Change contrast/brightness
                    </p>
                    <p>
                        <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete cancer selection
                    </p>
                    <hr />

                    <p className={'sub-menu-title'}> Marking a lesion </p>
                    <div className={'row'}>
                        <Col sm={7} className={'right-border'}>
                            <p  > 1. Place your mouse pointer over the site you want to mark </p>
                            <p  > 2. Double-click to mark a lesion </p>
                            <p  > 3. A pop-up menu will appear asking you to rate the lesion: </p>
                            <ul  >
                                <li >2 = Benign</li>
                                <li >3 = Equivocal</li>
                                <li >4 = Suspicious</li>
                                <li >5 = Malignant</li>
                            </ul>
                        </Col>
                        <Col sm={5}>
                            <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                        </Col>
                    </div>
                    <hr />
                    <p>
                        Tip: Rating a case 3, 4, or 5, means you are calling this case <span style={{color: '#42A5F5'}}>a positive. i.e. it requires further investigation / assessment.</span>
                    </p>
                    <hr />

                    <div className={'row'}>
                        <Col sm={7} className={'right-border'}>
                            <div>
                                <p  > 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s).  </p>
                                <p  > To select a lesion type: </p>
                                <ul  >
                                    <li >click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/> </li>
                                    <li >a list of lesion types will appear.</li>
                                    <li >Click on lesion type to select it.</li>
                                    <li >If you want to change the lesion type, then you can click again on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/>  and choose another lesion type.</li>
                                </ul>
                                <p>
                                    Tip: If you want to add a second lesion, please repeat all the above steps.
                                </p>
                            </div>
                        </Col>
                        <Col sm={5} >
                            <img src={require('Assets/img/instruction/img_list_lesion.png')} width={'70%'} alt={''} style={{margin: "45px auto"}}/>
                        </Col>
                    </div>
                    <hr />
                    <p>
                        Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                        If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                        However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
                    </p>
                    <hr />

                    <p className={'sub-menu-title'}> Normal cases </p>
                    <p>
                        If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar. An unannotated image will be recorded as rating 1 (normal).
                    </p>
                    <hr />

                    <p>
                        Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                        If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
                    </p>
                    <hr />

                    <p  className={'sub-menu-title'}> Submit your answers:  </p>
                    <p>
                        When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate feedback on your performance.
                    </p>
                </div>
        )
    }

    renderDBT() {
        return (
            <div>
                <p className={'sub-menu-title'}>The Tools bar</p>
                <p >
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
                    <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset image
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Change contrast/brightness
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete cancer selection
                </p>
                <hr />

                <p className={'sub-menu-title'}> Slices </p>
                <div className={'row'}>
                    <Col sm={5}>
                        <p  > Each breast view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view. </p>
                    </Col>
                    <Col sm={5}>
                        <img src={require('Assets/img/instruction/img_brest.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                    </Col>
                </div>
                <hr />

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7} >
                        <div>
                            <p  > 1. Place your mouse pointer over the site you want to mark  </p>
                            <p  > 2. Double-click to mark a lesion </p>
                            <p  > 3. A pop-up menu will appear asking you to rate the lesion: </p>
                        </div>
                    </Col>
                    <Col sm={5} >
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''}  style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr />
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this <span style={{color: '#42A5F5'}}>a positive case, i.e. it requires further investigation / assessment.</span>
                </p>
                <hr />

                <div className={'row'}>
                    <Col sm={7}>
                        <div>
                            <p  > 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s).  </p>
                            <p  > To select a lesion type: </p>
                            <ul  >
                                <li >click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/> </li>
                                <li >a list of lesion types will appear.</li>
                                <li >Click on lesion type to select it.</li>
                                <li >If you want to change the lesion type, then you can click again on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/>  and choose another lesion type.</li>
                            </ul>
                            <p>
                                Tip: If you want to add a second lesion, please repeat all the above steps.
                            </p>
                        </div>
                    </Col>
                    <Col sm={5} >
                        <img src={require('Assets/img/instruction/img_list_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr />
                <p>
                    Tip: If you see the same lesion on both MLO and CC, we recommend that you mark the sites on both views.
                    If you correctly locate the lesion on just 1 view, you will get full points for <span style={{color: '#42A5F5'}}>lesion sensitivity.</span>
                    However, if you correctly mark the lesion on two views, you will get full points for <span style={{color: '#42A5F5'}}>location sensitivity</span>, which is calculated for your JAFROC score.
                </p>
                <hr />


                <p className={'sub-menu-title'}> Normal cases </p>
                <p>
                    If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar. An unannotated image will be recorded as rating 1 (normal).
                </p>
                <hr />

                <p>
                    Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                    If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
                </p>
                <hr />

                <p  className={'sub-menu-title'}> Submit your answers:  </p>
                <p>
                    When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate feedback on your performance.
                </p>
            </div>
        )
    }

    renderCT() {
        return (
            <div>
                <p className={'sub-menu-title'}>The Tools bar</p>
                <p >
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
                    <img src={require("Assets/img/instruction/icon_eye.png")} className={'mr-10'} height={40} alt={''}/>View/hide cancer selection information
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_reset.png")} className={'mr-10'} height={40} alt={''}/>Reset image
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_cb.png")} className={'mr-10'} height={40} alt={''}/>Change contrast/brightness
                </p>
                <p>
                    <img src={require("Assets/img/instruction/icon_recyle.png")} className={'mr-10'} height={40} alt={''}/>Delete cancer selection
                </p>
                <hr />

                <p className={'sub-menu-title'}> Slices </p>
                <div className={'row'}>
                        <p> Each breast view has a slide bar to help you navigate through the image slices. Use the mouse or the up/down arrow keys on your keyboard to move through the slices for each view. </p>
                        <img src={require('Assets/img/instruction/img_ct.png')} width={'70%'} alt={''} style={{margin: 'auto'}}/>
                </div>
                <hr />

                <p className={'sub-menu-title'}> Marking a lesion </p>
                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p  > 1. Place your mouse pointer over the site you want to mark  </p>
                            <p  > 2. Double-click to mark a lesion </p>
                            <p  > 3. A pop-up menu will appear asking you to rate the lesion: </p>
                            <ul  >
                                <li >2 = Benign</li>
                                <li >3 = Equivocal</li>
                                <li >4 = Suspicious</li>
                                <li >5 = Malignant</li>
                            </ul>
                        </div>
                    </Col>
                    <Col sm={5} >
                        <img src={require('Assets/img/instruction/img_lesion.png')} width={'70%'} alt={''}  style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr />
                <p>
                    Tip: Rating a case 3, 4, or 5, means you are calling this <span style={{color: '#42A5F5'}}>a positive case, i.e. it requires further investigation / assessment.</span>
                </p>
                <hr />

                <div className={'row'}>
                    <Col sm={7} className={'right-border'}>
                        <div>
                            <p  > 4. For lesions given ratings of 3 or 4 or 5, you will have to select one or more lesion type(s).  </p>
                            <p  > To select a lesion type: </p>
                            <ul  >
                                <li >click on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/> </li>
                                <li >a list of lesion types will appear.</li>
                                <li >Click on lesion type to select it.</li>
                                <li >If you want to change the lesion type, then you can click again on <img src={require('Assets/img/instruction/img_select_lesion.png')} height={35} alt={''}/>  and choose another lesion type.</li>
                            </ul>
                            <p>Tip: If you want to add a second lesion, please repeat all the above steps.</p>
                        </div>
                    </Col>
                    <Col sm={5} >
                        <img src={require('Assets/img/instruction/img_list_lesion.png')} width={'70%'} alt={''} style={{margin: "auto"}}/>
                    </Col>
                </div>
                <hr />


                <p className={'sub-menu-title'}> Normal cases </p>
                <p>
                    If you think a case is normal, simply move to the next case by clicking on the <img src={require('Assets/img/instruction/btn_next.png')} height={35} alt={''}/> tool bar. An unannotated image will be recorded as rating 1 (normal).
                </p>
                <hr />

                <p>
                    Tip: A case with lesion rating 2 (benign) is considered a normal case, <span style={{color: '#42A5F5'}}>i.e. it requires no further investigation / assessment in a screening situation.</span>
                    If the case does contain a malignant lesion which you rated as 2 (benign), your lesion sensitivity will be adversely affected.
                </p>
                <hr />

                <p  className={'sub-menu-title'}> Submit your answers:  </p>
                <p>
                    When you reach the last case <img src={require('Assets/img/instruction/btn_finish.png')} height={35} alt={''}/>, will appear on the tool bar. Click to submit your answers and receive immediate feedback on your performance.
                </p>
            </div>
        )
    }

    renderContent() {
        if(this.state.activeIndex === 0) {
            return this.renderMammo();
        } else if(this.state.activeIndex === 1) {
            return this.renderDBT()
        } else if(this.state.activeIndex === 2) {
            return this.renderCT();
        } else {
            return null;
        }
    }

    render() {
        const {isOpen, toggle} = this.props;
        return (
            <FullDialog open={isOpen} onClose={toggle} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '80%'}}}>
                <div className={'instruction-container'}>
                    <DialogTitle>
                        <AppBar position="static" color="primary" style={{backgroundColor: 'black'}}>
                            <Tabs value={this.state.activeIndex} onChange={(e, value) => this.setState({activeIndex: value})}>
                                <Tab label="Mammo"/>
                                <Tab label="DBT" />
                                <Tab label="CT"/>
                            </Tabs>
                        </AppBar>
                    </DialogTitle>
                    <DialogContent className={'instruction-content'}>

                        {this.renderContent()}
                    </DialogContent>
                    <DialogActions>
                        <div style={{margin: 'auto'}}>
                            <Button variant="contained" onClick={toggle} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Close&nbsp;&nbsp;</Button>
                        </div>
                    </DialogActions>
                </div>
            </FullDialog>
        )
    }
}

const FullDialog = withStyles(theme => ({
    paper: {
        height: '100%',
        maxWidth: 1090
    }
}))(Dialog);