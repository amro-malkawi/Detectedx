/**
 * News Dashboard
 */

import React, { Component } from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

export default class instruction extends Component {
    render() {
        return (
            <div className="news-dashboard-wrapper">
                <PageTitleBar title={"Viewing the mammograms"} match={this.props.match} enableBreadCrumb={false}/>
                <p className="fs-14">To complete this test set, you will need access to a mammography workstation with the test sets (DICOM images) imported to your PACS.</p>
                <p className="fs-14">You should be viewing the cases in DICOM format on your mammography workstation (see ‘A’ below) and marking the cases on this scoring software (see ‘B’ below), to do this:</p>
                <p className="fs-14">First select the test set in the ‘My Test sets’ tab on this website.</p>
                <p className="fs-14">Then open the same test set from your PACS and display the first case.</p>
            </div>
        )
    }
}
