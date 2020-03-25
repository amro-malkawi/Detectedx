import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ImageBrowserItem from './ImageBrowserItem';

class ImageBrowser extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return(
            <div className={'image-browser ' + (this.props.isShowImageBrowser ? '' : 'hide')}>
                {
                    this.props.imageList.map((v, i) => (
                        <ImageBrowserItem item={v} key={i}/>
                    ))
                }
            </div>
        )
    };
}

// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        isShowImageBrowser: state.testView.isShowImageBrowser
    };
};

export default withRouter(connect(mapStateToProps)(ImageBrowser));