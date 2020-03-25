import React, {Component} from 'react';
import {Col} from "reactstrap";
import ImageGallery from 'react-image-gallery';

export default class Platform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
                {
                    original: require('Assets/img/site/platform-spin1.gif'),
                },
                {
                    original: require('Assets/img/site/platform-spin2.gif'),
                },
                {
                    original: require('Assets/img/site/platform-spin3.gif'),
                },
            ]
        }
    }

    render() {
        return (
            <div className={'site-platform'}>
                <div className={'row mt-30'}>
                    <Col sm={7}>
                        <span className={'platform-title'}>
                            A new educational approach to improving radiologists’ detection of cancer
                        </span>
                        <div className={'platform-info'}>
                            <span>
                                DetectED X is a powerful, personalised, on-line radiology training and research tool that is available world-wide and has been successfully tested in Australia, New Zealand, Asia, Middle East, US and Europe.​
                            </span>
                            <ul>
                                <li>
                                    Intelligent interactive platforms designed to improve the diagnostic efficacy of radiologists using clinically relevant cases.
                                </li>
                                <li>
                                    Immediate reader feedback with scores in lesion sensitivity, specificity and receiver operating characteristic (ROC).
                                </li>
                                <li>
                                    Personalised image files to instantly show correct decisions and any errors made.
                                </li>
                                <li>
                                    De-identified data on performances stored centrally and available for quality assurance and research purposes.
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <div className={'platform-img'}>
                            <img src={require("Assets/img/site/platform-background.jpg")}/>
                        </div>
                    </Col>
                </div>
                <div className={'gallery'}>
                    <ImageGallery items={this.state.images} showThumbnails={false} showFullscreenButton={false} showPlayButton={false} autoPlay slideInterval={3000} showBullets/>
                </div>
                <div className={'platform-sub-title mb-30'}>
                    <span>WHAT PEOPLE SAY</span>
                </div>
                <div className={'row desc-content-container'}>
                    <div>
                        <span className={'desc-content-title'}>Prof Warwick Lee, Radiologist Former State Radiologist, BreastScreen NSW</span>
                    </div>
                    <div>
                        <span className={'desc-content-title'}>PROF DIANNE GEORGIAN-SMITH, RADIOLOGIST, HARVARD MEDICAL SCHOOL</span>
                    </div>
                    <div>
                        <span className={'desc-content-title'}>DR MARIA COVA & MAURA TONUTTI, RADIOLOGISTS ITALIAN BREAST SCREENING SERVICE</span>
                    </div>
                    <div>
                        <span className={'desc-content-title'}>PROF CHARBEL SAADE AMERICAN UNIVERSITY OF BEIRUT.</span>
                    </div>
                    <div>
                        <span className={'desc-content-title'}>DR. MOHAMMAD RAWASHDEH JORDAN UNIVERSITY OF SCIENCE AND TECHNOLOGY</span>
                    </div>
                </div>
                <div className={'row desc-content-container mb-50'}>
                    <div>
                        <span className={'desc-content'}>The educational radiologic software that is available through DetectED-X is helping clinicians find cancer more effectively and recognise normal images more confidently.</span>
                    </div>
                    <div>
                        <span className={'desc-content'}>"The mammographic test sets and software Professor Brennan and his team have made available through DetectED-X are invaluable to the ongoing education of radiologists and trainees."</span>
                    </div>
                    <div>
                        <span className={'desc-content'}>We have used Professor’s Brennan’s image evaluation software in Italy and the clinicians loved it.  It will impact positively on our practices.</span>
                    </div>
                    <div>
                        <span className={'desc-content'}>DetectED-X is impacting on radiologic practices world-wide.  Thank goodness for its educational tools!</span>
                    </div>
                    <div>
                        <span className={'desc-content'}>DetectED-X produces the best diagnostic educational tools globally. Its software is transforming radiologic efficacy for trained and trainee clinicians.</span>
                    </div>
                </div>
            </div>
        )
    }
}