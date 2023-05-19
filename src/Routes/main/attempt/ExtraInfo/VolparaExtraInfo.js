import React, {useState} from 'react';
import {Button, DialogContent} from "@mui/material";
import VideoModal from "Routes/instructions/VideoModal";

export default function () {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={'score-extra'}>
            <p className={'extra-title'}>Extra information</p>
            <p className={'extra-desc'}>Learn more about volumetric reading with these educational videos.</p>
            <div className={'extra-button-container'}>
                <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => setShowModal(true)}>
                    Start Video
                </Button>
            </div>
            <VideoModal
                open={showModal}
                onClose={() => setShowModal(false)}
                link={'https://static.detectedx.com/instruction_video/densityED/score_extrainfo.mp4'}
                possibleClose
            />
        </div>
    )
}