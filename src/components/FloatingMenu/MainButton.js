/* eslint-disable react/no-unused-prop-types */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MainButton extends Component {
    static propTypes = {
        iconResting: PropTypes.node.isRequired,
        iconActive: PropTypes.node.isRequired,
        isOpen: PropTypes.bool,
        size: PropTypes.number,
    };

    static defaultProps = {
        isOpen: false,
        size: 56,
    };

    render() {
        const {iconResting, iconActive, isOpen} = this.props;

        return (
            <a
                {...this.props}
                className={'floating-menu-icon'}
                style={{
                    color: this.props.iconColor,
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
                    width: this.props.size,
                    height: this.props.size,
                    position: 'absolute',
                    top: 0,
                    // right: 0,
                    left: 3,
                    background: this.props.background,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        WebkitTransition: '-webkit-transform 300ms',
                        transition: 'transform 300ms',
                        WebkitTransform: `rotate(${isOpen ? 180 : 0}deg)`,
                        transform: `rotate(${isOpen ? 180 : 0}deg)`,
                    }}
                >
                    {isOpen ? iconActive : iconResting}
                </div>
            </a>
        );
    }
}

export default MainButton;
