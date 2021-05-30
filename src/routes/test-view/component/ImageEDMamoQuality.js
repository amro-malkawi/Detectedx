import React from "react";
import {connect} from "react-redux";

const ImageEDMamoQuality = ({imagePosition, imageEDBreastQuality}) => {
    try {
        if (!imagePosition || !imagePosition.viewPosition || !imagePosition.imageLaterality) return null;
        const truthQuality = imageEDBreastQuality.truth[imagePosition.viewPosition + '-' + imagePosition.imageLaterality];
        const answerQuality = imageEDBreastQuality.answer[imagePosition.viewPosition + '-' + imagePosition.imageLaterality];
        if (!truthQuality || !answerQuality) return null;
        return (
            <div className={'imageed-breast-quality'}>
                {
                    ['P', 'G', 'M', 'I'].map((v) => (
                        <div key={v}>
                            {v}
                            {truthQuality === v && <div className={'truth-circle'}/>}
                            {answerQuality === v && <div className={'answer-circle'}/>}
                        </div>
                    ))
                }
            </div>
        );
    } catch (e) {
        return null;
    }
}


// map state to props
const mapStateToProps = (state) => ({
    imageEDBreastQuality: state.testViewComp.imageEDBreastQuality,
});

export default connect(mapStateToProps, null)(ImageEDMamoQuality);

