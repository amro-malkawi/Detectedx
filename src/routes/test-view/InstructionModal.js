import React, {Component} from 'react';
import {Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

export default class InstructionModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
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
                                <Tab label="2D Case" />
                                {/*<Tab label="Item Two" />
                                <Tab label="Item Three" />*/}
                            </Tabs>
                        </AppBar>
                    </DialogTitle>
                    <DialogContent className={'instruction-content'}>
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
                                    <img height="300" src={require("Assets/img/help/Zoey.jpg")} className={"mt-20"} width="450" alt={''}/>
                                </p>
                                <p style={{fontWeight: 'bold', color: '#42A5F5'}}> Navigation tools </p>
                                <p > There are useful tools to help you navigate the test set. These can be found on the tool bar and the top left and right side of the screen. </p>
                                <p >
                                    <img src={require("Assets/img/help/header.png")} className={"mt-20"} width="1000" alt={''}/>
                                </p>
                                <p ><strong >Home</strong> tab will take you to the Information page </p>
                                <p ><strong >Instructions</strong>tab will take you to this page </p>
                                <p  ><strong >Show Controls </strong>allows you to show/hide tools and is on by default </p>
                                <p  ><strong >Background Loading </strong>allows you to load the succeeding cases as you view the current case. It is off by default </p>
                                <p  ><strong >Previous</strong> and <strong >Next </strong> buttons allow you to move forward and back through the set. Beside these is a drop-down menu showing the list of cases in this set. It allows you to jump to a specific case </p>
                                <p  ><strong >Brightness, Contrast</strong> and <strong >Invert </strong>functions are available to you </p>
                                <p style={{fontWeight: 'bold', color: '#42A5F5'}}> Icons </p>
                                <p  >
                                    <img height="50" src={require("Assets/img/help/2.png")} width="50" alt={''}/> Click to show or hide the rating and location that you marked for a lesion
                                </p>
                                <p >
                                    <img height="50" src={require("Assets/img/help/3.png")} width="50" alt={''}/>  Click to reset Brightness, Contrast, and Invert tools to original presentation
                                </p>
                                <p  >
                                    <img height="50" src={require("Assets/img/help/4.png")} width="50" alt={''}/>  Click to delete all lesions you’ve marked on the case
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