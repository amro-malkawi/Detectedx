import React from 'react';
import MarkerPopupNormal from "./markerPopupNormal";
import MarkerPopupLungED from "./markerPopupLungED";
import MarkerPopupTwoRating from "./markerPopupTwoRating";
import {useSelector} from "react-redux";

function MarkerPopup(props) {
    const modalityInfo = useSelector((state) => state.testView.modalityInfo);
    if(modalityInfo.name === 'LungED') {
        return <MarkerPopupLungED {...props} />
    } else if(modalityInfo.name === 'WB-CT-SS') {
        return <MarkerPopupTwoRating {...props} />
    } else {
        return <MarkerPopupNormal {...props} />
    }
}

export default MarkerPopup;


