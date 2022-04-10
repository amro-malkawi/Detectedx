import React from 'react';
import CovidQuestions from "./CovidQuestions";
import ChestQuestions from "./ChestQuestions";
import ImagEDMammoQuestions from "./ImagEDMammoQuestions";
import ImagEDChestQuestions from "./ImagEDChestQuestions";
import UltrasoundQuestion from './UltrasoundQuestion';
import ChestCTQuestions from "./ChestCTQuestion";
import LinEDQuestions from "./LinEDQuestions";
import QuizQuestions from './QuizQuestions';
import WBCTQuestions from './WBCTQuestions';

const SideQuestions = React.forwardRef((props, ref) => {
    const {modality_type, name} = props.modalityInfo;
    switch (modality_type) {
        case 'covid':
            return <CovidQuestions ref={ref} {...props} />
        case 'chest':
            return name !== 'LinED' ? <ChestQuestions ref={ref} {...props} /> : <LinEDQuestions ref={ref} {...props} />
        case 'imaged_mammo':
            return <ImagEDMammoQuestions ref={ref} {...props} />
        case 'imaged_chest':
            return <ImagEDChestQuestions ref={ref} {...props} />
        case 'ultrasound':
            return <UltrasoundQuestion ref={ref} {...props} />
        case 'chest_ct':
            return <ChestCTQuestions ref={ref} {...props} />
        case 'quiz':
        case 'video_lecture':
        case 'presentations':
            return <QuizQuestions ref={ref} {...props} />
        case 'wb_ct':
            return <WBCTQuestions ref={ref} {...props} />
        default:
            return null;
    }
});

export default SideQuestions;