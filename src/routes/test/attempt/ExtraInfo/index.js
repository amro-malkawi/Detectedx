import React from 'react';
import MammoExtraInfo from "./MammoExtraInfo";
import CovidExtraInfo from "./CovidExtraInfo";
import VolparaExtraInfo from "./VolparaExtraInfo";
import ImagedExtraInfo from "./ImagedExtraInfo";

export default function ({open, onClose, modality_type}) {
    console.log(modality_type, '3212341234')
    switch (modality_type) {
        case "covid":
            return <CovidExtraInfo open={open} onClose={onClose}/>
        case "volpara":
            return <VolparaExtraInfo open={open} onClose={onClose}/>
        case "imaged_mammo":
        case "imaged_chest":
            return <ImagedExtraInfo open={open} onClose={onClose}/>
        case 'quiz':
        case 'video_lecture':
        case 'presentations':
            return null;
        default:
            return <MammoExtraInfo open={open} onClose={onClose}/>
    }
}
