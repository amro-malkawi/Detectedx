import React from 'react';
import CovidQuestions from "./CovidQuestions";
import ChestQuestions from "./ChestQuestions";
import ImagEDMammoQuestions from "./ImagEDMammoQuestions";
import ImagEDChestQuestions from "./ImagEDChestQuestions";

const SideQuestions = React.forwardRef((props, ref) => {
    switch (props.modality_type) {
        case "covid":
            return <CovidQuestions ref={ref} {...props} />
        case "chest":
            return <ChestQuestions ref={ref} {...props} />
        case "imaged_mammo":
            return <ImagEDMammoQuestions ref={ref} {...props} />
        case "imaged_chest":
            return <ImagEDChestQuestions ref={ref} {...props} />
        default:
            return null;
    }
});

export default SideQuestions;