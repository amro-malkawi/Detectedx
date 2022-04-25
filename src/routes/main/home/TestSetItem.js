import React, {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import PropTypes from "prop-types";
import classNames from 'classnames';
import * as Apis from 'Api';
import * as selectors from "Selectors";
import {apiUploadAddress} from "Api";

TestSetItem.defaultProps = {
    smallSize: false
}

TestSetItem.propTypes = {
    smallSize: PropTypes.bool,
}

function TestSetItem({data, onClick, smallSize}) {
    const [testSetType, setTestSetType] = useState('');

    useEffect(() => {
        let type = '';
        if(data.modalityInfo.modality_type === 'quiz') {
            type = 'quiz';
        } else if (data.modalityInfo.modality_type === 'video_lecture') {
            type = 'LECTURE';
        } else if (data.modalityInfo.modality_type === 'presentations') {
            type = 'PRESENTATIONS';
        } else {
            type = 'SELF ASSESSMENT MODULE';
        }
        setTestSetType(type);
    }, [data]);

    const renderDifficult = (difficult) => {
        if(!difficult) {
            return (<div className={'test-set-difficult'}><div/><div/><div/></div>)
        } else if(difficult === 1) {
            return (<div className={'test-set-difficult'}><div className={'active'}/><div/><div/></div>)
        } else if(difficult === 2) {
            return (<div className={'test-set-difficult'}><div className={'active'}/><div className={'active'}/><div/></div>)
        } else {
            return (<div className={'test-set-difficult'}><div className={'active'}/><div className={'active'}/><div className={'active'}/></div>)
        }
    }

    return (
        <Button
            className={classNames('test-set-item', {'small-test-set-item': smallSize})}
            style={{backgroundColor: data.modalityInfo.modality_color ? data.modalityInfo.modality_color : '#534ED9'}}
            onClick={onClick}
        >
            {
                data.modalityInfo.modality_icon_image &&
                <img src={Apis.apiUploadAddress + data.modalityInfo.modality_icon_image} className={'test-set-item-img'} alt={''} />
            }
            <div className={'d-flex flex-row justify-content-between align-items-center'}>
                <div className={'d-flex flex-row align-items-center'}>
                    <span className={'test-category'}>{testSetType}</span>
                    <span>{data.test_set_category}</span>
                </div>
                {
                    data.name.toLowerCase().indexOf('3d') !== -1 &&
                    <div className={'mark-3d'}>
                        <img src={require('Assets/img/main/icon_3d.svg')} alt={''} />
                    </div>
                }
            </div>
            <div className={'test-set-name'}>
                {data.name}
            </div>
            {
                !smallSize &&
                <div className={'test-set-item-spec'}>
                    <span>DIFFICULTY</span>
                    {
                        renderDifficult(data.difficulty)
                    }
                    <span className={'mr-40'}>{data.test_set_time || 0}MINS</span>
                    <span className={''}>CME: {data.test_set_point}</span>
                </div>
            }
            {
                data.demoTestSet &&
                <div className={'test-set-item-demo'}>
                    <div className={'demo-bar fs-16 fw-semi-bold'}>
                        FREE DEMO
                    </div>
                </div>
            }
        </Button>
    )
}

export default TestSetItem;