import React, {useState} from 'react'
import {Input} from "reactstrap";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {Scrollbars} from "react-custom-scrollbars";
import {useSelector} from "react-redux";
import TestSetItem from "Routes/main/home/TestSetItem";

const tempInfo = {
    "id": "f6812ede-cd3a-42fa-a23d-9bcfc362de1b",
    "name": "3D mammograpthy 15 cases(DBT2)",
    "difficulty": 0,
    "has_post": false,
    "modality_id": "7298f803-d30b-11e9-af2c-54a050d2ebba",
    "test_set_desc": "",
    "test_set_show": false,
    "test_set_point": 0,
    "attempts": [{
        "id": "231ad3df-ee6a-4034-abe0-e78524c16f36",
        "user_id": "b44f30dc-d30b-11e9-af2c-54a050d2ebba",
        "test_set_id": "f6812ede-cd3a-42fa-a23d-9bcfc362de1b",
        "progress": "test",
        "complete": false,
        "post_stage": 0,
        "post_test_complete": false,
        "post_test_attempt_count": 1,
        "current_test_case_id": "77c362cc-9390-41e9-bb80-2db770ce4135",
        "monitor_width": 0,
        "monitor_height": 0,
        "show_start_video": true,
        "view_answer_time": null,
        "attempt_sub_type": null,
        "created_at": "2021-09-10T04:28:18.000Z",
        "updated_at": "2021-09-10T04:28:18.000Z"
    }],
    "test_set_paid": true,
    "is_test_set_expired": false,
    "test_set_expiry_date": "2022-09-10T04:28:18.000Z",
    "post_test_count": 0,
    "test_set_price": {"price": 0, "currency": "AUD"},
    "modalityInfo": {
        "id": "7298f803-d30b-11e9-af2c-54a050d2ebba",
        "name": "BreastED - DBT 3D",
        "modality_type": "normal",
        "modality_icon_image": "/modality_icons/6e4f9330-54a1-4909-a806-767092e12078.png",
        "instruction_video_thumbnail": "https://static.detectedx.com/instruction_video/mammography/thumbnail.png",
        "instruction_type": "DBT",
        "instruction_video": "https://static.detectedx.com/instruction_video/dbt/dbt.mov",
        "modality_desc": "{\"en\":\"<h3><strong>What to expect:</strong></h3><div>These units consist of multiple digital breast tomosynthesis cases for you to judge and decide whether a cancer is present. Some cases have cancers, other do not.</div><div>Each case is presented in high resolution with drop down menus and image processing options typically available in clinical practice.</div><div><br></div><div>Once you have completed the cases, you will instantly receive your personal performance scores and then you can review all the cases and see your correct and incorrect decisions, and view assessment images.</div><div><br></div><h3><strong>How you earn your credits:</strong></h3><div>To earn AMA PRA Category 1 Credit/s™ you will also need to complete a short post test. The number of AMA credits you can earn is 2 credit per 10 cases.</div><div>Eg. 30 cases = 6 AMA PRA Category 1 Credits™</div><div><br></div><div>3 RANZCR CPD points can be claimed per hour for participation in any of the below activities</div>\"}",
        "modality_show": true,
        "modality_has_sub_type": true
    }
}

function PersonalComponent() {
    const [userName, setUserName] = useState(useSelector((state) => state.authUser.userName));

    return (
        <div className={'profile-content flex-row'}>
            <div className={'personal-content'}>
                <div className={'personal-item-list'}>
                    <div className={'personal-item'}>
                        <span>FULL NAME</span>
                        <Input type={'text'} value={userName} onChange={(e) => setUserName(e.target.value)}/>
                    </div>
                    <div className={'personal-item'}>
                        <span>GENDER</span>
                        <RadioGroup row defaultValue={'0'}>
                            <FormControlLabel
                                value={'0'}
                                control={<Radio color={'primary'}/>}
                                label={'NOT SPECIFIED'}
                            />
                            <FormControlLabel
                                value={'1'}
                                control={<Radio color={'primary'}/>}
                                label={'FEMALE'}
                            />
                            <FormControlLabel
                                value={'2'}
                                control={<Radio color={'primary'}/>}
                                label={'MALE'}
                            />
                        </RadioGroup>
                    </div>
                    <div className={'personal-item'}>
                        <span>DATE OF BIRTH</span>
                        <Input type={'date'}/>
                    </div>
                    <div className={'personal-item'}>
                        <span>LOCATION</span>
                        <Input type={'text'}/>
                    </div>
                </div>
            </div>
            <div className={'completed-list'}>
                <span className={'fs-15 text-primary1 mb-3'}>RECENTLY COMPLETED</span>
                <Scrollbars
                    autoHide
                    autoHideDuration={100}
                >
                    <div className="personal-completed-test">
                        <TestSetItem smallSize data={tempInfo} onClick={() => null}/>
                        <TestSetItem smallSize data={tempInfo} onClick={() => null}/>
                        <TestSetItem smallSize data={tempInfo} onClick={() => null}/>
                        <TestSetItem smallSize data={tempInfo} onClick={() => null}/>
                        <TestSetItem smallSize data={tempInfo} onClick={() => null}/>
                    </div>
                </Scrollbars>
            </div>
        </div>
    )
}

export default PersonalComponent