import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styledJss from 'styled-jss';
import MdAdd from '@material-ui/icons/Menu';
import MdClose from '@material-ui/icons/Clear';
import MainButton from "./MainButton";

export const DIRECTIONS = {
    up: 'column-reverse',
    down: 'column',
    left: 'row-reverse',
    right: 'row',
};

const StyledUl = styledJss('ul')(
    ({direction}) => ({
        display: 'flex',
        width: 'fit-content',
        // maxHeight: 200,
        listStyle: 'none',
        margin: '0',
        paddingTop: 30,
        flexDirection: DIRECTIONS[direction],
        justifyContent: 'center',
        alignItems: 'left',
    }),
);

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
            <StyledUl
                className={className}
                onClick={this.toggleMenu}
                direction={direction}
            >
                <MainButton
                    iconResting={<MdAdd style={{fontSize: 20, color: '#FFB300"'}}/>}
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
            </StyledUl>
        );
    }
}

export default FloatingMenu;
