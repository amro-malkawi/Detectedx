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
    }

    onChangeHanging(index) {
        this.setState({ selectedIndex: index, type: null });
        this.props.changeHangingLayout(this.props.testSetHangingIdList[index]);
    }

    render() {
        if(this.props.testSetHangingIdList.length > 0) {
            const {type} = this.state;
            const selectedIndex = this.props.testSetHangingIdList.findIndex((v) => v === this.props.selectedHangingType);
            return (
                <div className={'hanging-type-container'}>
                    <Button variant="contained" color="default" className={'hanging-button'} onClick={(event) => this.setState({type: event.currentTarget})}>
                        <img src={require('Assets/img/hangings/' + this.props.selectedHangingType + '.png')} width={70} alt=''/>
                    </Button>
                    <StyledMenu
                        id="lock-menu"
                        anchorEl={type}
                        open={Boolean(type)}
                        onClose={() => this.setState({type: null})}
                    >
                        {this.props.testSetHangingIdList.map((option, index) => (
                            <StyledMenuItem
                                key={option}
                                selected={index === selectedIndex}
                                onClick={(event) => this.onChangeHanging(index)}
                            >
                                <img src={require('Assets/img/hangings/' + option + '.png')} width={70} alt=''/>
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
        testSetHangingIdList: state.testView.testSetHangingIdList,
        selectedHangingType: state.testView.selectedHangingType,
    };
};

export default withRouter(connect(mapStateToProps, {
    changeHangingLayout
})(HangingSelector));

