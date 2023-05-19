/* eslint-disable no-nested-ternary  */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Fab, Tooltip} from '@mui/material';

class ChildButton extends Component {
    static propTypes = {
        direction: PropTypes.string,
        index: PropTypes.number,
        onClick: PropTypes.func,
        isOpen: PropTypes.bool,
        size: PropTypes.number,
        spacing: PropTypes.number,
        label: PropTypes.string,
        active: PropTypes.bool,
        buttonTooltip: PropTypes.string,
    };

    static defaultProps = {
        direction: 'up',
        index: 1,
        iconColor: 'black',
        size: '40',
        spacing: 0,
        isOpen: false,
        onClick: null,
        label: '',
        active: false,
        buttonTooltip: '',
    };

    render() {
        const {
            answerCount,
            truthCount,
            index,
            direction,
            size,
            spacing,
            isOpen,
            background,
            onClick,
            label,
            active,
            buttonTooltip
        } = this.props;
        const offsetX =
            direction === 'right' ? (size + spacing) * index :
                direction === 'left' ? (size + spacing) * index * -1 : 0;
        const offsetY =
            direction === 'down' ? (size + spacing) * index :
                direction === 'up' ? (size + spacing) * index * -1 : 0;
        return (
            <div
                style={{
                    marginTop: 10,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    opacity: isOpen ? 1 : 0,
                    transition: "all 200ms",
                    transform: `translate(${isOpen ? 0 : -offsetX}px, ${isOpen ? 0 : -offsetY}px)`,
                }}
            >
                {
                    label !== '' ?
                        <Button
                            variant="contained"
                            size="small"
                            style={{marginRight: 5, color: active ? 'black' : '#FFB300', background: active ? '#FFB300' : 'transparent'}}
                            onClick={isOpen ? onClick : null}
                        >
                            {label}
                        </Button> : null
                }
                {
                    answerCount ?
                        <Tooltip title={buttonTooltip} placement="bottom">
                            <Fab size="small" onClick={isOpen ? onClick : null} style={{marginRight: 5, background: '#FFB300'}}>
                                <span>{answerCount}</span>
                            </Fab>
                        </Tooltip> : null
                }
                {
                    truthCount ?
                        <Tooltip title={buttonTooltip} placement="bottom">
                            <Fab size="small" onClick={isOpen ? onClick : null} style={{background: 'red'}}>
                                <span>{truthCount}</span>
                            </Fab>
                        </Tooltip> : null
                }
            </div>
        )
    }
}

export default ChildButton;
