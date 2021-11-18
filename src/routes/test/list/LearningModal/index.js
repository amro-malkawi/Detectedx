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
import LearningGEUSAPostModal from "./LearningGEUSAPostModal";

export default ({open, modalityInfo, testSetInfo, onClose}) => {
    if (!open) return null;
    const testSetName = testSetInfo.name;
    const postTestCount = testSetInfo.post_test_count;
    const credit = testSetInfo.test_set_point;
    const {instruction_type, modality_type} = modalityInfo;
    console.log(modalityInfo)
    if (modalityInfo.name === 'DentalED') {
        return <LearningDeltalEDModal open={open} onClose={onClose}/>
    } else if (modalityInfo.name === 'GE 3D' && testSetInfo.has_post) {
        return <LearningGEUSAPostModal open={open} onClose={onClose} name={testSetName} postTestCount={postTestCount} credit={credit} />
    } else if (instruction_type === 'COVID-19') {
        return testSetInfo.has_post ?
            <USCovidStartModal open={open} onClose={onClose}/> :
            <LearningCovidModal open={open} onClose={onClose}/>
    } else if (instruction_type === 'VOLPARA') {
        return testSetInfo.has_post ?
            <LearningVolparaPostModal name={testSetName} postTestCount={postTestCount} credit={credit} open={open} onClose={onClose}/> :
            <LearningVolparaModal name={testSetName} postTestCount={postTestCount} credit={credit} open={open} onClose={onClose}/>
    } else if (instruction_type === 'LUNGED') {
        return <LearningLungEDModal open={open} onClose={onClose}/>
    } else if (modality_type === 'imaged_chest') {
        return <LearningImagEDChestModal open={open} onClose={onClose}/>
    } else if (modality_type === 'imaged_mammo') {
        return <LearningImagEDMammoModal open={open} onClose={onClose}/>
    } else {
        return testSetInfo.has_post ?
            <USStartModal open={open} name={testSetName} postTestCount={postTestCount} credit={credit} onClose={onClose}/> :
            <LearningNormalModal open={open} onClose={onClose}/>
    }
}