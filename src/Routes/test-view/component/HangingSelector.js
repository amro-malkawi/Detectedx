import React, {Component} from 'react'
import {connect} from "react-redux";
import {changeHangingLayout} from "Store/Actions";
import {Button, MenuItem, Menu} from '@mui/material';
import withRouter from 'Components/WithRouter';
import {withStyles} from 'tss-react/mui';


const StyledMenu = withStyles(Menu, (theme) => ({
    paper: {
        border: '1px solid #d3d4d5',
        backgroundColor: 'black',
    },
}));

const StyledMenuItem = withStyles(MenuItem, (theme) => ({
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
}));


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

    renderHangingIcon(value) {
        try {
            const imgSrc = require('Assets/img/hangings/' + value + '.png')
            return <img src={imgSrc} width={70} alt=''/>
        } catch (e) {
            // remove first hangingID when chest
            return <span className={'hanging-id-text'}>{value.split('_').pop()}</span>
        }
    }

    render() {
        if(this.props.testSetHangingIdList.length > 0) {
            const {type} = this.state;
            const selectedIndex = this.props.testSetHangingIdList.findIndex((v) => v === this.props.selectedHangingType);
            return (
                <div className={'hanging-type-container'}>
                    <Button
                        onKeyUp={(e) => e.preventDefault()}
                        variant="contained" className={'hanging-button'}
                        onClick={(event) => this.setState({type: event.currentTarget})}
                    >
                        {this.renderHangingIcon(this.props.selectedHangingType)}
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
                                {this.renderHangingIcon(option)}
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

