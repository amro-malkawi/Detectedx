import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Button, Dialog, Tooltip} from '@mui/material';
import {isMobile} from 'react-device-detect';
import SeriesInfo from "./SeriesInfo";
import TestSetInfo from "./TestSetInfo";

function TestSetModal({data, onClose}) {
    const [testSetData, setTestSetData] = useState(data.tileType === 'series' ? null : data);

    useEffect(() => {

    }, []);

    return (
        <Dialog open={true} maxWidth={'xl'} className={!isMobile ? 'main-test-set-modal-container' : 'main-test-set-mobile-modal'} onClose={onClose}>
            {
                testSetData !== null ?
                    <TestSetInfo data={testSetData} onClose={onClose} onBackSeries={data.tileType === 'series' ? () => setTestSetData(null) : null}/> :
                    <SeriesInfo data={data} onClose={onClose} onSelect={(testSet) => setTestSetData(testSet)}/>
            }
        </Dialog>
    )
}

export default TestSetModal;