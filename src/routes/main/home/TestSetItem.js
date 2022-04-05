import React from 'react';
import {Button} from '@material-ui/core';
import classNames from 'classnames';

function TestSetItem({data}) {

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
        <Button className={'test-set-item'} style={{backgroundColor: "#534ED9"}}>
            <img src={require('Assets/img/main/temp_bg.png')} className={'test-set-item-img'} alt={''} />
            <div className={'d-flex flex-row justify-content-between align-items-center'}>
                <div className={'d-flex flex-row align-items-center'}>
                    <span className={'modality-type'}>SELF ASSESSMENT MODULE</span>
                    <span>BREAST</span>
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
            <div className={'test-set-item-bottom d-flex flex-row align-items-center fs-15'}>
                <span>DIFFICULT</span>
                {
                    renderDifficult(data.difficulty)
                }
                <span className={'mr-40'}>60MINS</span>
                <span className={''}>CME: {data.test_set_point}</span>
            </div>
            {
                data.attempts.some((v) => v.complete) &&
                <div className={'test-set-item-complete'}>
                    <div className={'complete-bar fs-16 fw-semi-bold'}>
                        COMPLETED
                    </div>
                </div>
            }
        </Button>
    )
}

export default TestSetItem;