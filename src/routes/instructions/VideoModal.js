import React, {Component} from 'react';
import {Dialog, DialogContent} from "@material-ui/core";
import ReactPlayer from 'react-player';
import PropTypes from "prop-types";

export default class VideoModal extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        link: PropTypes.string,
        possibleClose: PropTypes.bool
    };

    static defaultProps = {
        possibleClose: true
    };

    constructor(props) {
        super(props);
        this.state = {
            possibleClose: props.possibleClose
        }
        this.playedSeconds = 0;
        this.playerRef = React.createRef();
    }

    onClose() {
        if(this.state.possibleClose) {
            this.props.onClose();
        }
    }

    handleProgress(e) {
        if(!this.state.possibleClose && (e.playedSeconds - this.playedSeconds) > 2) {
            this.playerRef.current.seekTo(parseFloat(this.playedSeconds), 'seconds');
        } else {
            this.playedSeconds = e.playedSeconds;
        }
    }

    handleSeek(seekTime) {
        if(!this.state.possibleClose && (seekTime - this.playedSeconds) > 0.1) {
            //impossilbe seek
            this.playerRef.current.seekTo(parseFloat(this.playedSeconds), 'seconds');
        }
    }

    handleEnded() {
        this.setState({possibleClose: true});
        // this.playerRef.current.seekTo(0, 'seconds');
        // this.playedSeconds = 0;

    }

    render() {
        const {open, link} = this.props;
        return (
            <Dialog open={open} onClose={() => this.onClose()} style={{backgroundColor: '#000000d0'}}
                    aria-labelledby="alert-dialog-title" maxWidth='xl'
                    PaperProps={{style: {padding: 10, backgroundColor: 'transparent', boxShadow: 'none'}}}
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
                {
                    this.state.possibleClose &&
                    <div className={'video-close-button'} onClick={() => this.onClose()}>
                        <i className="zmdi zmdi-close-circle"/>
                    </div>
                }
            </Dialog>
        )
    }
}