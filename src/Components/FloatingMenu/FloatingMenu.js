import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdAdd from '@mui/icons-material/Menu';
import MdClose from '@mui/icons-material/Clear';
import MainButton from "./MainButton";
import Tooltip from "@mui/material/Tooltip";

export const DIRECTIONS = {
    up: 'column-reverse',
    down: 'column',
    left: 'row-reverse',
    right: 'row',
};

class FloatingMenu extends Component {
    static propTypes = {
        className: PropTypes.string,
        // children: PropTypes.arrayOf(PropTypes.element).isRequired,
        slideSpeed: PropTypes.number,
        spacing: PropTypes.number,
        direction: PropTypes.string,
        isOpen: PropTypes.bool,
    };

    static defaultProps = {
        className: '',
        slideSpeed: 500,
        direction: 'down',
        isOpen: false,
        spacing: 8,
    };

    render() {
        const {slideSpeed, direction, className, isOpen, spacing, onClose, isScroll, itemContainerClass} = this.props;
        const childrenWithProps = React.Children.map(this.props.children, (child, index) =>
            React.cloneElement(child, {
                isOpen,
                slideSpeed,
                direction,
                index,
                spacing,
            }),
        );

        return (
            <ul
                className={className}
                onClick={this.toggleMenu}
                style={{
                    display: 'flex',
                    width: 'fit-content',
                    listStyle: 'none',
                    margin: '0',
                    paddingTop: 30,
                    flexDirection: DIRECTIONS[direction],
                    justifyContent: 'center',
                    alignItems: 'left',
                }}
            >
                <MainButton
                    iconResting={<Tooltip title={"View Slice"}><MdAdd style={{fontSize: 20, color: '#FFB300'}}/></Tooltip>}
                    iconActive={<MdClose style={{fontSize: 20, color: '#FFB300'}}/>}
                    background={"transparent"}
                    isOpen={isOpen}
                    onClick={onClose}
                    size={30}
                />
                <div
                    className={itemContainerClass}
                    style={{
                        maxHeight: isOpen ? 510 : 0,
                        paddingRight: 5,
                        overflowY: isScroll ? 'scroll' : 'none',
                        transition: isOpen ? "max-height 0.1s ease-in" : "max-height 0.3s ease-out",
                    }}
                >
                    {childrenWithProps}
                </div>
            </ul>
        );
    }
}

export default FloatingMenu;
