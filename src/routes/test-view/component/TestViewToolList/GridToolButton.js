import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Menu, withStyles} from '@material-ui/core';
import CornerstoneToolIcon from "./CornerstoneToolIcon";
import IntlMessages from "Util/IntlMessages";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeImageViewGrid} from "Actions/TestViewAction";

class GridToolButton extends PureComponent {
    static defaultProps = {
        dropdownVisible: false,
    };

    static propTypes = {
        dropdownVisible: PropTypes.bool.isRequired,
        /** Called with the selectedCell number when grid sell is selected */
        onChange: PropTypes.func,
        /** The cell to show as selected */
        selectedCell: PropTypes.object,
    };

    state = {
        dropdownVisible: this.props.dropdownVisible,
        menuTarget: null
    };

    componentDidUpdate(prevProps) {
        if (this.props.dropdownVisible !== prevProps.dropdownVisible) {
            this.setState({
                dropdownVisible: this.props.dropdownVisible,
            });
        }
    }

    onClick = (event) => {
        this.setState({
            dropdownVisible: !this.state.dropdownVisible,
            menuTarget: event.currentTarget
        });
    };

    onChange = selectedCell => {
        this.props.changeImageViewGrid(selectedCell.row + 1, selectedCell.col + 1);
        if (this.props.onChange) {
            this.props.onChange(selectedCell);
        }
    };

    render() {
        return (
            <div data-cy="grid-tool" className={"tool option"} onClick={this.onClick}>
                {<CornerstoneToolIcon name={'Grid'}/>}
                <p><IntlMessages id={"testView.tool.grid"}/></p>
                <LayoutMenu
                    anchorEl={this.state.menuTarget}
                    open={this.state.dropdownVisible}
                >
                    <LayoutGrid
                        visible={this.state.dropdownVisible}
                        onChange={this.onChange}
                        onClick={this.onClick}
                        selectedCell={this.props.selectedCell}
                    />
                </LayoutMenu>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = (state) => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, {
    changeImageViewGrid
})(GridToolButton));


class LayoutGrid extends PureComponent {
    static propTypes = {
        Rows: PropTypes.number.isRequired,
        Columns: PropTypes.number.isRequired,
        visible: PropTypes.bool.isRequired,
        selectedCell: PropTypes.object,
        boxSize: PropTypes.number.isRequired,
        cellBorder: PropTypes.number.isRequired,
        onClick: PropTypes.func,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        Rows: 2,
        Columns: 4,
        visible: true,
        boxSize: 20,
        cellBorder: 1,
        selectedCell: {
            row: -1,
            col: -1,
        },
    };

    constructor(props) {
        super(props);
        this.emptyCell = {
            row: -1,
            column: -1,
        };
        this.state = {
            table: [[]],
            selectedCell: this.props.selectedCell,
        };
    }

    componentDidMount() {
        this.highlightCells(this.emptyCell);
    }

    onClick(currentCell) {
        this.setState({
            selectedCell: currentCell,
        });
        this.highlightCells(currentCell);
        if (this.props.onClick) {
            this.props.onClick(currentCell);
        }
        if (this.props.onChange) {
            this.props.onChange(currentCell);
        }
    }

    isRange = (cell, parentCell) => {
        return cell.row <= parentCell.row && cell.col <= parentCell.col;
    };
    highlightCells = currentCell => {
        let table = [];
        for (let row = 0; row < this.props.Rows; row++) {
            let newRow = [];
            for (let col = 0; col < this.props.Columns; col++) {
                let cell = {row: row, col: col};
                if (this.isRange(cell, currentCell)) {
                    cell.className = 'hover';
                } else if (
                    this.isRange(currentCell, this.emptyCell) &&
                    this.isRange(cell, this.state.selectedCell)
                ) {
                    cell.className = 'selectedBefore';
                }
                newRow.push(cell);
            }
            table.push(newRow);
        }
        this.setState({table: table});
    };

    render() {
        let Columns = this.props.Columns;
        const style = {
            minWidth:
                Columns * this.props.boxSize + (Columns + 5) * this.props.cellBorder,
        };
        return (
            <div
                className="layoutChooser layoutChooser-dropdown-menu"
                role="menu"
                style={style}
            >
                <table>
                    <tbody>
                    {this.state.table.map((row, i) => {
                        return (
                            <tr key={i}>
                                {row.map((cell, j) => {
                                    return (
                                        <td
                                            className={cell.className}
                                            style={{
                                                width: this.props.boxSize,
                                                height: this.props.boxSize,
                                                border: 'solid 1px black',
                                            }}
                                            key={j}
                                            onMouseEnter={() => this.highlightCells(cell)}
                                            onMouseLeave={() => this.highlightCells(this.emptyCell)}
                                            onClick={() => this.onClick(cell)}
                                        />
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

const LayoutMenu = withStyles({
    paper: {
        marginTop: 42,
        marginLeft: -13,
        backgroundColor: 'transparent',
    },
})(Menu);