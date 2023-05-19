import React from 'react';
import MarkerPopupNormal from "./markerPopupNormal";
import MarkerPopupLungED from "./markerPopupLungED";
import MarkerPopupWBCT from "./markerPopupWBCT";
import {useSelector} from "react-redux";

function MarkerPopup(props) {
    const modalityInfo = useSelector((state) => state.testView.modalityInfo);
    if(modalityInfo.name === 'LungED') {
        return <MarkerPopupLungED {...props} />
    } else if(modalityInfo.modality_type === 'wb_ct') {
        return <MarkerPopupWBCT {...props} />
    } else {
        return <MarkerPopupNormal {...props} />
    }
}

export default MarkerPopup;


