import React, {Component} from 'react';
import {Col} from "reactstrap";
import { Input } from 'reactstrap';
import Button from "@material-ui/core/Button";

export default class ContactUs extends Component {
    render() {
        return (
            <div className={'site-contact'}>
                <div className={'row contact-background'}>
                    <Col sm={6} className={'contact-info'}>
                        <p className={'contact-title align-top'}>Contact Us</p>
                        <div className={'contact-content'}>
                            <div className={'contact-address-container align-bottom'}>
                                <div className={'split-line'} />
                                <p className={'contact-address'}>
                                    Sydney Knowledge Hub Level 2 H04 Merewether Building The University of Sydney NSW 2006
                                </p>
                                <p className={'contact-touch-text'}>
                                    Get In Touch
                                </p>
                            </div>
                            <div className={'contact-form'}>
                                <Input name="name" id="name" placeholder="Name*" />
                                <Input type="email" name="email" id="email" placeholder="Email*" />
                                <Input name="subject" id="subject" placeholder="Subject" />
                                <Input type="textarea" name="message" id="Message" placeholder="Message"/>
                                <Button variant="contained" className="send-btn">
                                    Send
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className={'social-icons'}>
                            <a href="https://twitter.com/detected_x" target="_blank">
                                <i className="zmdi zmdi-twitter"/>
                            </a>
                            <a href="https://www.linkedin.com/company/detected-x" target="_blank">
                                <i className="zmdi zmdi-linkedin"/>
                            </a>
                            <a href="https://www.facebook.com/DetectEDX1" target="_blank">
                                <i className="zmdi zmdi-facebook"/>
                            </a>
                            <a href="https://www.instagram.com/detected.x" target="_blank">
                                <i className="zmdi zmdi-instagram"/>
                            </a>
                        </div>
                    </Col>
                </div>
            </div>
        )
    }
}