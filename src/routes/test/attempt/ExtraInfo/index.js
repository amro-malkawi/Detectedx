import React from 'react';
import MammoExtraInfo from "./MammoExtraInfo";
import CovidExtraInfo from "./CovidExtraInfo";
import VolparaExtraInfo from "./VolparaExtraInfo";

export default function ({open, onClose, instruction_type}) {
    console.log(instruction_type, 'isntruction_type')
    switch (instruction_type) {
        case "COVID-19":
            return <CovidExtraInfo open={open} onClose={onClose}/>
        case "VOLPARA":
            return <VolparaExtraInfo open={open} onClose={onClose}/>
        default:
            return <MammoExtraInfo open={open} onClose={onClose}/>
    }
}