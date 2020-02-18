/**
 * Rct Horizontal Menu Layout
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";

// Components
import SiteHeader from 'Components/Header/SiteHeader';

class RctAgencyLayout extends Component {

    renderPage() {
        const { pathname } = this.props.location;
        const { children, match } = this.props;
        return (
            <Scrollbars
                className="rct-scroll"
                autoHide
                autoHideDuration={100}
                style={{ height: 'calc(100vh - 85px)' }}
            >
                <div className="rct-site-page-content">
                    {children}
                </div>
            </Scrollbars>
        );
    }

    render() {
        return (
            <div className={`app-site bg-white`}>
                <div className="app-container">
                    <div className="rct-page-wrapper">
                        <div className="rct-app-content">
                            <div className="app-header">
                                <SiteHeader />
                            </div>
                            <div className="rct-site-page">
                                {this.renderPage()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    const { agencyLayoutBgColors } = settings;
    return { agencyLayoutBgColors }
}

export default connect(mapStateToProps)(withRouter(RctAgencyLayout));
