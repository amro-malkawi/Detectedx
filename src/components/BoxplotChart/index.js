import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Input} from 'reactstrap';
import {
    select as d3Select,
    quantile as d3Quantile,
    ascending as d3Ascending,
    scaleLinear as d3ScaleLinear,
    line as d3Line,
    axisLeft as d3AxisLeft,
    axisBottom as d3AxisBottom,
    axisTop as d3AxisTop,
} from "d3"
import * as Apis from 'Api';

class BoxplotChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userPosition: 'all',
            userPositionList: [],
            score: 0,
            quartile_25: 0,
            quartile_50: 0,
            quartile_75: 0,
            scoreTimes: 1,  // range 0~100: times = 1, range 0~1: times = 100
        }
    }

    componentDidMount() {
        this.renderBoxplot();
        this.getData();
        Apis.userPositions().then((resp) => {
            this.setState({userPositionList: resp})
        });
    }

    getData() {
        Apis.attemptsPercentile(this.props.attempt_id, this.props.score_type, this.state.userPosition).then((resp) => {
            let quartile_25 = resp[25], quartile_50 = resp[50], quartile_75 = resp[75];
            let scoreTimes = 1;
            if(quartile_25 <= 1 && quartile_50 <=1 && quartile_75 <= 1 && resp['max'] <=1 ) {
                scoreTimes = 100;
            }

            this.setState({
                quartile_25,
                quartile_50,
                quartile_75,
                scoreTimes
            }, () => {
                this.renderBoxplot();
            });
        });
    }

    onChangeUserPosition(userPosition) {
        this.setState({userPosition}, () => {
            this.getData();
        });
    }

    renderBoxplot() {
        // empty all content
        this.gaugeDiv.innerHTML = '';
        // set the dimensions and margins of the graph
        let margin = {top: 10, right: 30, bottom: 10, left: 30};
        let width = this.gaugeDiv.offsetWidth - margin.left - margin.right;
        let height = 100 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        let svg = d3Select(this.gaugeDiv)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ")");

        // create dummy data
        // let data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9];
        // let data_sorted = data.sort(d3Ascending);
        // let q1 = d3Quantile(data_sorted, .25);
        // let median = d3Quantile(data_sorted, .5);
        // let q3 = d3Quantile(data_sorted, .75);
        const q1 = this.state.quartile_25 * this.state.scoreTimes;
        const median = this.state.quartile_50 * this.state.scoreTimes;
        const q3 = this.state.quartile_75 * this.state.scoreTimes;
        const value = this.props.value * this.state.scoreTimes;

        let min = q1 - (q3 - q1);
        min = min < 0 ? 0 : min;
        min = min > value - 2 ? value - 2 : min;

        let max = q3 + (q3 - q1);
        max = max > 100 ? 100 : max;
        max = max < value +2 ? value + 2 : max;

        // Show the x scale
        let x = d3ScaleLinear()
            .domain([min, max])
            .range([0, width]);
        svg
            .append("g")
            .attr("stroke", "#8f8f8f")
            .style("font-family", "din-next-w01-light, sans-serif")
            .attr("transform", "translate(0," + height + ")")
            // .call(d3AxisBottom(x).tickValues([q1, median, q3, value]));
            .call(d3AxisBottom(x).tickValues([q1, median, q3, value]).tickFormat(d => d / this.state.scoreTimes));

        // a few features for the box
        let center = 40;
        width = 40;

        // Show the main horizontal line
        svg
            .append("line")
            .attr("x1", x(min + 1))
            .attr("x2", x(max - 1))
            .attr("y1", center)
            .attr("y2", center)
            .attr("stroke", "#8f8f8f");

        // boxes
        svg
            .append("rect")
            .attr("x", x(q1))
            .attr("y", center - width / 2)
            .attr("width", (x(median) - x(q1)))
            .attr("height", width)
            .attr("stroke", "transparent")
            .style("fill", "#69b4f3");

        svg
            .append("rect")
            .attr("x", x(median))
            .attr("y", center - width / 2)
            .attr("width", (x(q3) - x(median)))
            .attr("height", width)
            .attr("stroke", "transparent")
            .style("fill", "#1a5ea1");

        // median line
        svg
            .append("line")
            .attr("x1", x(median))
            .attr("y1", (center - width / 2) - 5)
            .attr("x2", x(median))
            .attr("y2", center - width / 2)
            .attr("stroke", "#8f8f8f");

        // median line text
        svg
            .append("text")
            .attr("x", x(median) - 17)
            .attr("y", (center - width / 2) - 15)
            .text("Median")
            .style("font-size", "11px")
            .style("font-family", "din-next-w01-light, sans-serif")
            .attr("stroke", "#8f8f8f")
            .attr("alignment-baseline","middle");

        // needle icon
        svg
            .append('circle')
            .style("stroke", "transparent")
            .style("fill", "#fa6400")
            .attr("r", 5)
            .attr("cx", x(value))
            .attr("cy", center + 15);
        const lineGenerator = d3Line();
        svg
            .append('path')
            .attr('d', lineGenerator([[x(value) - 3, center + 15], [x(value) + 3, center + 15], [x(value), center - 5]]))
            .style("stroke", "transparent")
            .style("fill", "#fa6400")

    }

    renderUserType() {
        if(this.props.score_type.indexOf('volpara') !== -1) return null;
        return (
            <Input type="select" name="select" onChange={(e) => this.onChangeUserPosition(e.target.value)}>
                <option value={'all'}>All</option>
                {
                    this.state.userPositionList.map((v) => <option value={v.id} key={v.id}>{v.name}</option>)
                }
            </Input>
        )
    }

    render() {
        return (
            <div className={'score-chart'}>
                <div className={'score-chart-title'}>
                    <span>{this.props.title}</span>
                    {this.renderUserType()}
                </div>
                <div ref={(ref) => (this.gaugeDiv = ref)}/>
            </div>
        )
    }

}

BoxplotChart.propTypes = {
    title: PropTypes.string || PropTypes.object,
    quartile_25: PropTypes.number.isRequired,
    quartile_50: PropTypes.number.isRequired,
    quartile_75: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

export default BoxplotChart