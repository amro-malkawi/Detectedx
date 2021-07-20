import React from "react";
import {connect} from "react-redux";

const ImageEDMamoQuality = ({imagePosition, imageEDBreastQuality}) => {
    try {
        if (!imagePosition || !imagePosition.viewPosition || !imagePosition.imageLaterality) return null;
        const viewPosition = imagePosition.viewPosition.indexOf('CC') !== -1 ? 'CC' : (imagePosition.viewPosition.indexOf('MLO') !== -1 ? 'MLO' : '');
        const imageLaterality = imagePosition.imageLaterality;
        const truthQuality = imageEDBreastQuality.truth[viewPosition + '-' + imageLaterality];
        const answerQuality = imageEDBreastQuality.answer[viewPosition + '-' + imageLaterality];
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

