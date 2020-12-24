import React, {Component} from 'react';
import {Dialog, DialogContent} from "@material-ui/core";
import ReactPlayer from 'react-player';

export default class VideoModal extends Component {
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}
                    aria-labelledby="alert-dialog-title" maxWidth='xl' PaperProps={{style: {backgroundColor: 'transparent'}}}
            >
                <DialogContent style={{padding: 0}}>
                    <ReactPlayer url={this.props.link} playing controls width={'60vw'} height={'33.75vw'}/>
                </DialogContent>
            </Dialog>
        )
    }
}