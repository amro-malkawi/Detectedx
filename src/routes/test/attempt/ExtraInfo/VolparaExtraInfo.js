import React, {useState} from 'react';
import {Button, DialogContent} from "@material-ui/core";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import DarkerDialog from "Components/Dialog/DarkerDialog";
import IntlMessages from "Util/IntlMessages";
import VideoModal from "Routes/instructions/VideoModal";

export default function () {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={'score-extra'}>
            <p className={'extra-title'}><IntlMessages id="test.attempt.volparaExtraTitle"/></p>
            <p className={'extra-desc'}><IntlMessages id="test.attempt.volparaExtraDesc"/></p>
            <div className={'extra-button-container'}>
                <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => setShowModal(true)}>
                    <IntlMessages id="test.attempt.volparaNext"/>
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