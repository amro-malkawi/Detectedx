import React, {Component} from 'react';
import {Button, Col} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab} from "@material-ui/core";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import InstructionCovid from "./InstructionCovid";
import InstructionMammo from "./InstructionMammo";
import InstructionDBT from "./InstructionDBT";
import InstructionCT from "./InstructionCT";
import InstructionLungED from "./InstructionLungED";
import InstructionPCT from "./InstructionPCT";
import InstructionVolpara from "./InstructionVolpara";
import InstructionDentalED from "./InstructionDentalED";
import InstructionQuality from "./InstructionQuality";
import InstructionGECESM from "./InstructionGECESM";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            isShowVideoModal: false,
        }
    }

    renderContent() {
        const {type} = this.props;
        if (type === 'Mammo') {
            return <InstructionMammo instructionLocale={this.props.locale} />
        } else if (type === 'DBT') {
            return <InstructionDBT instructionLocale={this.props.locale}/>
        } else if (type === 'CT') {
            return <InstructionCT instructionLocale={this.props.locale} />
        } else if (type === 'COVID-19') {
            return <InstructionCovid instructionLocale={this.props.locale} />
        } else if (type === 'LUNGED') {
            return <InstructionLungED instructionLocale={this.props.locale} />
        } else if (type === 'PCT') {
            return <InstructionPCT instructionLocale={this.props.locale} />
        } else if (type === 'VOLPARA') {
            return <InstructionVolpara instructionLocale={this.props.locale} />
        } else if (type === 'DENTALED') {
            return <InstructionDentalED instructionLocale={this.props.locale} />
        } else if (type === 'QUALITY') {
            return <InstructionQuality instructionLocale={this.props.locale} />
        } else if (type === 'GE-CESM') {
            return <InstructionGECESM instructionLocale={this.props.locale} />
        } else if (type === 'all') {
            if (this.state.activeIndex === 1) {
                return <InstructionMammo instructionLocale={this.props.locale} />
            } else if (this.state.activeIndex === 2) {
                return <InstructionDBT instructionLocale={this.props.locale} />
            } else if (this.state.activeIndex === 3) {
                return <InstructionCT instructionLocale={this.props.locale}/>
            } else if (this.state.activeIndex === 0) {
                return <InstructionCovid instructionLocale={this.props.locale}/>
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    render() {
        const {theme, onClose, type} = this.props;
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
                    </DialogContent>
                    <DialogActions className={'mt-10'}>
                        <div style={{margin: 'auto'}}>
                            {
                                onClose ? <Button variant="contained" onClick={onClose} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Close&nbsp;&nbsp;</Button> : null
                            }
                        </div>
                    </DialogActions>
                </div>
            </div>
        )
    }
}


// map state to props
const mapStateToProps = (state) => {
    return {
        locale: state.settings.locale.locale,
    };
};

export default withRouter(connect(mapStateToProps)(Content));