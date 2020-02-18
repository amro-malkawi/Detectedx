import React, {Component} from 'react';
import {Col} from "reactstrap";
import {Link} from "react-router-dom";

export default class AboutUs extends Component {
    render() {
        return (
            <div className={'site-about-us'}>
                <div className={'row'}>
                    <Col sm={4}>
                        <figure className="img-wrapper">
                            <img src={require('Assets/img/site/about1.jpg')} className="img-fluid" alt="gallery 1"/>
                            <div className={'about-user-name'}>
                                <span>Professor Patrick Brennan</span>
                            </div>
                            <figcaption>
                                <div className={'mt-50 mb-50'}>
                                    <span className={'about-desc'}>World's most highly published medical radiation scientist and award-winning educator</span>
                                </div>
                                <div className={'social-icons'}>
                                    <a href="https://www.researchgate.net/profile/Patrick_Brennan2" target="_blank">
                                        <img src={require("Assets/img/site/rg_icon.png")} alt="" className={'rg-icon mr-20'}/>
                                    </a>
                                    <a href="https://www.linkedin.com/in/patrick-brennan-phd-75995b110/" target="_blank">
                                        <i className="zmdi zmdi-linkedin linkedin-icon mr-20"/>
                                    </a>
                                </div>
                            </figcaption>

                        </figure>
                    </Col>
                    <Col sm={4}>
                        <figure className="img-wrapper">
                            <img src={require('Assets/img/site/about2.jpg')} className="img-fluid" alt="gallery 1"/>
                            <div className={'about-user-name'}>
                                <span>Professor Mary Rickard</span>
                            </div>
                            <figcaption>
                                <div className={'mt-50 mb-50'}>
                                    <span className={'about-desc'}>Consultant Radiologist and pioneer of breast screening in Australia and SE Asia </span>
                                </div>
                            </figcaption>

                        </figure>
                    </Col>
                    <Col sm={4}>
                        <figure className="img-wrapper">
                            <img src={require('Assets/img/site/about3.jpg')} className="img-fluid" alt="gallery 1"/>
                            <div className={'about-user-name'}>
                                <span>Dr Moayyad Suleiman</span>
                            </div>
                            <figcaption>
                                <div className={'mt-50 mb-50'}>
                                    <span className={'about-desc'}>Leading expert on radiologic performance, medical image optimisation and radiation optimisation. </span>
                                </div>
                                <div className={'social-icons'}>
                                    <a href="https://www.researchgate.net/profile/Moayyad_Suleiman" target="_blank">
                                        <img src={require("Assets/img/site/rg_icon.png")} alt="" className={'rg-icon mr-20'}/>
                                    </a>
                                    <a href="https://www.linkedin.com/in/moe-suleiman-10698229/" target="_blank">
                                        <i className="zmdi zmdi-linkedin linkedin-icon mr-20"/>
                                    </a>
                                </div>
                            </figcaption>

                        </figure>
                    </Col>
                </div>
            </div>
        )
    }
}