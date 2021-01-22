import React, {Component} from 'react';
import {Dialog, DialogContent} from "@material-ui/core";
import ReactPlayer from 'react-player';
import PropTypes from "prop-types";

export default class VideoModal extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        link: PropTypes.string.isRequired,
        possibleClose: PropTypes.bool
    };

    static defaultProps = {
        possibleClose: true
    };

    constructor(props) {
        super(props);
        this.possibleClose = props.possibleClose;
        this.playedSeconds = 0;
        this.playerRef = React.createRef();
    }

    onClose() {
        if(this.possibleClose) {
            this.props.onClose();
        }
    }

    handleProgress(e) {
        if(!this.possibleClose && (e.playedSeconds - this.playedSeconds) > 2) {
            this.playerRef.current.seekTo(parseFloat(this.playedSeconds), 'seconds');
        } else {
            this.playedSeconds = e.playedSeconds;
        }
    }

    handleSeek(seekTime) {
        if(!this.possibleClose && (seekTime - this.playedSeconds) > 0.1) {
            //impossilbe seek
            this.playerRef.current.seekTo(parseFloat(this.playedSeconds), 'seconds');
        }
    }

    handleEnded() {
        this.possibleClose = true;
        // this.playerRef.current.seekTo(0, 'seconds');
        // this.playedSeconds = 0;

    }

    render() {
        const {open, onClose, link} = this.props;
        return (
            <Dialog open={open} onClose={() => this.onClose()} style={{backgroundColor: '#000000d0'}}
                    aria-labelledby="alert-dialog-title" maxWidth='xl' PaperProps={{style: {backgroundColor: 'transparent'}}}
            >
                <DialogContent style={{padding: 0}}>
                    <ReactPlayer
                        ref={this.playerRef}
                        url={link}
                        playing
                        controls
                        width={'60vw'}
                        height={'33.75vw'}
                        onProgress={(e) => this.handleProgress(e)}
                        onSeek={(time) => this.handleSeek(time)}
                        onEnded={() => this.handleEnded()}
                    />
                </DialogContent>
            </Dialog>
        )
    }
}