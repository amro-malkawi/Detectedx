import React, {Component} from 'react';
import cornerstone from "cornerstone-core";

export default class ImageThumbnail extends Component {
    constructor(props) {
        super(props);
        this.thumbnailImageRef = React.createRef();
    }

    componentDidMount() {
        this.thumbnailElement = this.thumbnailImageRef.current;
        cornerstone.enable(this.thumbnailElement);
        cornerstone.loadImage(this.props.image_url_path + '0', {}).then((image) => {
            cornerstone.displayImage(this.thumbnailElement, image);
        }).catch((e) => {
            console.log(e)
        });
    }

    render() {
        return (
            <div className="image-thumbnail-canvas" ref={this.thumbnailImageRef}/>
        )
    }
}