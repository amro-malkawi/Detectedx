import React from 'react';
import {Input} from 'reactstrap';
import {Button} from '@material-ui/core';

function CompletedComponent() {
    const renderCompletedLine = (v) => {
        const color = '#534ed9';
        return (
            <tr style={{backgroundColor: color}} key={v}>
                <td>B-Reader Preparation</td>
                <td><span style={{color: color}}>SELF ASSESSMENT MODULE</span></td>
                <td>BREAST</td>
                <td>SBMC22-01</td>
                <td className={'text-center'}>1</td>
                <td className={'text-center'}>3</td>
                <td>
                    <Button><span style={{color: color}}>CONTINUE</span></Button>
                </td>
            </tr>
        )
    }

    const renderAttemptLine = (v) => {
        return(
            <tr key={v} style={{backgroundColor: '#534ed9'}}>
                <td className={'text-center'}>01</td>
                <td className={'text-center'}>02/11/2021</td>
                <td className={'text-center'}>02/11/2021</td>
                <td>
                    <Button className={'profile-attempt-view-btn'}>
                        <img src={require('Assets/img/main/icon_eye.svg')} alt={''} />
                        VIEW
                    </Button>
                </td>
            </tr>
        )
    }

    return (
        <div className={'profile-content flex-column fw-semi-bold'}>
            <div className={'profile-completed-content'}>
                <div className={'profile-completed-top'}>
                    <div className={'d-flex flex-row align-items-center'}>
                        <div className={'fs-15 text-primary1 mr-40'}>COMPLETED</div>
                        <Input type={'select'}>
                            <option>FILTER</option>
                            <option>COMPLETED</option>
                        </Input>
                    </div>
                    <div className={'fs-15 text-primary1 cursor-pointer'}>
                        EXPORT TO PDF
                    </div>
                </div>
                <div className={'profile-completed-table'}>
                    <table>
                        <thead>
                        <tr>
                            <th>NAME</th>
                            <th>TYPE</th>
                            <th>CATEGORY</th>
                            <th>MODULE</th>
                            <th className={'text-center'}>POINTS</th>
                            <th className={'text-center'}>ATTEMPTS</th>
                            <th>REPORT</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3,].map((v, i) => renderCompletedLine(i))
                        }
                        </tbody>
                    </table>
                </div>
                <div className={'profile-completed-bottom fs-15'}>
                    <div className={'profile-completed-bottom-title'}>
                        <span>LAST 12 MONTH TOTAL</span>
                        <div className={'d-flex flex-row mr-50'}>
                            <div className={'mr-40 text-center'} style={{width: 70}}>POINTS</div>
                            <div className={'mr-50 text-center'} style={{width: 70}}>ATTEMPTS</div>
                        </div>
                    </div>
                    <div className={'d-flex flex-row justify-content-end mr-50'}>
                        <div className={'mr-40 text-center'} style={{width: 70}}>7</div>
                        <div className={'mr-50 text-center'} style={{width: 70}}>14</div>
                    </div>
                </div>
            </div>
        </div>
    )



    return (
        <div className={'profile-content flex-column fw-semi-bold'}>
            <div className={'profile-completed-content'}>
                <div className={'profile-completed-top'}>
                    <div className={'d-flex flex-row align-items-center'}>
                        <div className={'d-flex flex-row align-items-center fs-15 text-primary1 mr-40'}>
                            <i className="zmdi zmdi-chevron-left fs-23 mr-2"/>
                            BACK
                        </div>
                        <div className={'d-flex flex-row align-items-end'}>
                            <div className={'fs-23 mr-20'}>B-Reader Preparation</div>
                            <div className={'fs-15 mb-1'}>SMBC22-01</div>
                        </div>
                    </div>
                    <div>
                        <Button className={'profile-complete-reattempt'}>REATTEMPT</Button>
                    </div>
                </div>
                <div className={'profile-attempt-table'}>
                    <table>
                        <thead>
                        <tr>
                            <th className={'text-center'}>ATTEMPT NUMBER</th>
                            <th className={'text-center'}>START DATE</th>
                            <th className={'text-center'}>END DATE</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((v) => renderAttemptLine(v))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CompletedComponent;