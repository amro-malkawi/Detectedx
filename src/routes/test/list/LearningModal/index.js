import React from 'react';
import LearningNormalModal from "./LearningNormalModal";
import USStartModal from "./USStartModal";
import LearningCovidModal from "./LearningCovidModal";
import USCovidStartModal from "./USCovidStartModal";
import LearningVolparaModal from "./LearningVolparaModal";
import LearningVolparaPostModal from "./LearningVolparaPostModal";
import LearningDeltalEDModal from "./LearningDeltalEDModal";
import LearningLungEDModal from "./LearningLungEDModal";
import LearningImagEDChestModal from "./LearningImagEDChestModal";
import LearningImagEDMammoModal from "./LearningImagEDMammoModal";

export default ({open, type, name, postTestCount, credit, onClose}) => {
    if(!open) return null;
    if (type === 'normal') {
        return <LearningNormalModal open={open} onClose={onClose} />
    } else if (type === 'has_post') {
        return <USStartModal open={open} name={name} postTestCount={postTestCount} credit={credit} onClose={onClose} />
    } else if (type === 'covid') {
        return <LearningCovidModal open={open} onClose={onClose} />
    } else if (type === 'has_post_covid') {
        return <USCovidStartModal open={open} onClose={onClose} />
    } else if (type === 'volpara') {
        return <LearningVolparaModal name={name} postTestCount={postTestCount} credit={credit} open={open} onClose={onClose} />
    } else if (type === 'has_post_volpara') {
        return <LearningVolparaPostModal name={name} postTestCount={postTestCount} credit={credit} open={open} onClose={onClose} />
    } else if (type === 'dentalED') {
        return <LearningDeltalEDModal open={open} onClose={onClose} />
    } else if( type === 'LUNGED') {
        return <LearningLungEDModal open={open} onClose={onClose} />
    } else if( type === 'IMAGED_CHEST') {
        return <LearningImagEDChestModal open={open} onClose={onClose} />
    } else if( type === 'IMAGED_MAMMO') {
        return <LearningImagEDMammoModal open={open} onClose={onClose} />
    } else {
        return null;
    }
}