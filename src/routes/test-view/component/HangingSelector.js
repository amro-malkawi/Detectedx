import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeHangingLayout} from "Actions";
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        backgroundColor: 'black',
    },
})(props => (
    <Menu
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: 'grey'
        },
        '&:hover': {
            backgroundColor: 'grey'
        }
    },
    selected: {
        backgroundColor: '#1565C0 !important'
    }
}))(MenuItem);


class HangingSelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            selectedIndex: 0,
        };
        this.options = [];
    }

    onChangeHanging(index) {
        this.setState({ selectedIndex: index, type: null });
        this.props.changeHangingLayout(this.options[index]);
    }

    render() {
        if(this.props.hasAllTestImages) {
            if(this.props.hasAllPriorImages) {
                this.options = [
                    'CC-R_CC-L_MLO-R_MLO-L',
                    'CC-R_CC-L',
                    'MLO-R_MLO-L',
                    'CC-R_MLO-R',
                    'CC-L_MLO-L',
                    'CC-R_CC-R-P',
                    'MLO-R_MLO-R-P',
                    'CC-L_CC-L-P',
                    'MLO-L_MLO-L-P',
                    'CC-R_CC-R-P_MLO-R_MLO-R-P',
                    'MLO-L_MLO-L-P_CC-L-P_CC-L'
                ];
            } else {
                this.options = [
                    'CC-R_CC-L_MLO-R_MLO-L',
                    'CC-R_CC-L',
                    'MLO-R_MLO-L',
                    'CC-R_MLO-R',
                    'CC-L_MLO-L',
                ];
            }
            const {type} = this.state;
            const selectedIndex = this.options.findIndex((v) => v === this.props.hangingType);
            return (
                <div className={'hanging-type-container'}>
                    <Button variant="contained" color="default" className={'hanging-button'} onClick={(event) => this.setState({type: event.currentTarget})}>
                        <img src={require('Assets/img/hangings/' + this.props.hangingType + '.png')} width={70}/>
                    </Button>
                    <StyledMenu
                        id="lock-menu"
                        anchorEl={type}
                        open={Boolean(type)}
                        onClose={() => this.setState({type: null})}
                    >
                        {this.options.map((option, index) => (
                            <StyledMenuItem
                                key={option}
                                selected={index === selectedIndex}
                                onClick={(event) => this.onChangeHanging(index)}
                            >
                                <img src={require('Assets/img/hangings/' + option + '.png')} width={70}/>
                            </StyledMenuItem>
                        ))}
                    </StyledMenu>
                </div>
            );
        } else {
            return null;
        }
    }
}

// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        showImageList: state.testView.showImageList,
        hasAllTestImages: state.testView.hasAllTestImages,
        hasAllPriorImages: state.testView.hasAllPriorImages,
        hangingType: state.testView.hangingType,
    };
};

export default withRouter(connect(mapStateToProps, {
    changeHangingLayout
})(HangingSelector));

