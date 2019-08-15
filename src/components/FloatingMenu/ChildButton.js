/* eslint-disable no-nested-ternary  */
import React, {Component} from 'react';
import styled from 'styled-jss';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Tooltip from "@material-ui/core/Tooltip";

const Wrapper = styled('li')(
    ({isOpen, slideSpeed, background, size, iconColor, spacing, direction}) => ({
        background,
        display: 'flex',
        border: 'none',
        borderRadius: '50%',
        boxShadow: '0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28)',
        cursor: 'pointer',
        outline: 'none',
        padding: '0',
        WebkitUserDrag: 'none',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isOpen ? 1 : 0,
        transition: `all ${slideSpeed}ms`,
        width: size,
        height: size,
        marginTop: direction === 'down' ? spacing : 0,
        marginBottom: direction === 'up' ? spacing : 0,
        marginLeft: direction === 'right' ? spacing : 0,
        marginRight: direction === 'left' ? spacing : 0,
        color: iconColor,
        pointerEvents: isOpen ? 'auto' : 'none',
    }),
);

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

    render1() {
        const {
            icon,
            index,
            direction,
            size,
            spacing,
            isOpen,
            onClick,
        } = this.props;
        const offsetX =
            direction === 'right' ? (size + spacing) * index :
                direction === 'left' ? (size + spacing) * index * -1 : 0;
        const offsetY =
            direction === 'down' ? (size + spacing) * index :
                direction === 'up' ? (size + spacing) * index * -1 : 0;

        return (
            <Wrapper
                {...this.props}
                onClick={isOpen ? onClick : null}
                style={{
                    transform: `translate(${isOpen ? 0 : -offsetX}px, ${isOpen ? 0 : -offsetY}px)`,
                }}
            >
                {icon}
            </Wrapper>
        );
    }
}

export default ChildButton;
