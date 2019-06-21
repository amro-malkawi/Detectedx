/**
 * News Dashboard
 */

import React, { Component } from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

export default class home extends Component {
    render() {
        return (
            <div className="news-dashboard-wrapper">
                <PageTitleBar title={"Welcome!"} match={this.props.match} enableBreadCrumb={false}/>
                <p className="fs-14">BREAST is a self-assessment tool designed to enhance the performance of radiologists and other clinicians involved with diagnosing cancers on medical images.</p>
                <p className="fs-14">Here you’ll view clinically relevant test sets that include an unspecified number of cancers. One set should take between 60 and 90 minutes to complete. When you finish with the last case and submit your answers, you will instantly get your scores.</p>
                <p className="fs-14">This software also allows you to:</p>
                <p className="fs-14">Review each image with your answers mapped to the correct answers</p>
                <p className="fs-14">See how your scores compare with others</p>
                <p className="fs-14">Download a completion certificate for CPD points</p>
                <p className="fs-14">For help with how to do a test set click on the Instructions button at anytime</p>
                <p className="fs-14">To contact the BREAST helpdesk, email breastaustralia@sydney.edu.au or phone +61 2 93519586</p>
            </div>
        )
    }
}
