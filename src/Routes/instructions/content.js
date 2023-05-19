import React, {Component} from 'react';
import {Button, Col} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab} from "@mui/material";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import InstructionCovid from "./InstructionCovid";
import InstructionMammo from "./InstructionMammo";
import InstructionDBT from "./InstructionDBT";
import InstructionCT from "./InstructionCT";
import InstructionLungED from "./InstructionLungED";
import InstructionPCT from "./InstructionPCT";
import InstructionVolpara from "./InstructionVolpara";
import InstructionDentalED from "./InstructionDentalED";
import InstructionImagEDMammo from "./InstructionImagEDMammo";
import InstructionGECESM from "./InstructionGECESM";
import InstructionCHEST from "./InstructionCHEST";
import InstructionImagEDChest from "./InstructionImagEDChest";
import InstructionWBCTSS from './InstructionWBCTSS';
import withRouter from 'Components/WithRouter';
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
            return <InstructionMammo />
        } else if (type === 'DBT') {
            return <InstructionDBT/>
        } else if (type === 'CT') {
            return <InstructionCT />
        } else if (type === 'COVID-19') {
            return <InstructionCovid />
        } else if (type === 'LUNGED') {
            return <InstructionLungED />
        } else if (type === 'PCT') {
            return <InstructionPCT />
        } else if (type === 'VOLPARA') {
            return <InstructionVolpara />
        } else if (type === 'DENTALED') {
            return <InstructionDentalED />
        } else if (type === 'IMAGEDMAMMO') {
            return <InstructionImagEDMammo />
        } else if (type === 'GE-CESM') {
            return <InstructionGECESM />
        } else if (type === 'CHEST') {
            return <InstructionCHEST />
        } else if (type === 'IMAGED-CHEST') {
            return <InstructionImagEDChest />
        }  else if (type === 'WB-CT-SS') {
            return <InstructionWBCTSS />
        } else if (type === 'all') {
            if (this.state.activeIndex === 1) {
                return <InstructionMammo />
            } else if (this.state.activeIndex === 2) {
                return <InstructionDBT />
            } else if (this.state.activeIndex === 3) {
                return <InstructionCT/>
            } else if (this.state.activeIndex === 0) {
                return <InstructionCovid/>
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
    };
};

export default withRouter(connect(mapStateToProps)(Content));