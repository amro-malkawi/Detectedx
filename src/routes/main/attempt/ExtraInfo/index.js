import React from 'react';
import MammoExtraInfo from "./MammoExtraInfo";
import CovidExtraInfo from "./CovidExtraInfo";
import VolparaExtraInfo from "./VolparaExtraInfo";

export default function ({open, onClose, modality_type}) {
    switch (modality_type) {
        case "covid":
            return <CovidExtraInfo open={open} onClose={onClose}/>
        case "volpara":
            return <VolparaExtraInfo open={open} onClose={onClose}/>
        case "imaged_mammo":
        case "imaged_chest":
        case 'quiz':
        case 'video_lecture':
        case 'presentations':
            return null;
        default:
            return <MammoExtraInfo open={open} onClose={onClose}/>
    }
}
