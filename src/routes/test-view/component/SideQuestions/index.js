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
import InteractiveVideoQuestion from './InteractiveVideoQuestion';
import ChestMultiDiseaseQuestion from './ChestMultiDiseaseQuestion';
import { DynamicQuestions } from 'Routes/test-view/component/SideQuestions/DynamicQuestions';

const SideQuestions = React.forwardRef((props, ref) => {
    const {modality_type, name} = props.modalityInfo;

    if (props.questions && props.questions.length > 0) {
        return <DynamicQuestions
            sideQuestionsRef={ref}
            questions={props.questions}
            testCaseId={props.test_case_id}
            attemptId={props.attempts_id}
            isPostTest={props.isPostTest}
            confidenceQuestion={props.confidenceQuestion}
            complete={props.complete}
        />;
    }

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
            return name !== 'Chest Multi Disease' ? <ChestCTQuestions ref={ref} {...props} /> : <ChestMultiDiseaseQuestion ref={ref} {...props} />
        case 'quiz':
        case 'video_lecture':
        // case 'presentations':
            return <QuizQuestions ref={ref} {...props} />
        case 'wb_ct':
            return <WBCTQuestions ref={ref} {...props} />
        case 'interactive_video':
            return <InteractiveVideoQuestion ref={ref} {...props} />
        default:
            return null;
    }
});

export default SideQuestions;
