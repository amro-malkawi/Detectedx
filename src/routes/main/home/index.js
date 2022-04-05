import React, {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';
import TestSetItem from "./TestSetItem";
import TestSetModal from './TestSetModal';
import * as Apis from 'Api';

function Home() {
    const [modalityList, setModalityList] = useState([]);
    const [selectedModalityIndex, setSelectedModalityIndex] = useState(0);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Apis.currentTestSets().then((resp) => {
            setModalityList(resp);
        });
    }

    const renderModalityItem = ({modality_info}, index) => {
        return (
            <Button key={modality_info.id} className={classNames('modality-name-item', {active: index === selectedModalityIndex})} onClick={() => setSelectedModalityIndex(index)}>
                <i className={classNames('zmdi fs-23', (index === selectedModalityIndex ? 'zmdi-check' : 'zmdi-close'))}/>
                <span className={classNames({'fs-18': modality_info.name.length < 20}, {'fs-16': modality_info.name.length >= 20})}>{modality_info.name}</span>
            </Button>
        )
    }

    return (
        <div className={'main-home d-flex flex-row'}>
            <div className={'main-home-side'}>
                <div className={'mb-30'}>
                    <span className={'fs-23'}>Categories</span>
                </div>

                <Scrollbars
                    className="main-modalities"
                    autoHide
                    autoHideDuration={100}
                >
                    <div>
                        {
                            modalityList.map((v, i) => renderModalityItem(v, i))
                        }
                    </div>
                </Scrollbars>
            </div>
            <div className={'test-set-content'}>
                <div className={'d-flex flex-row fs-23 mb-30'}>
                    <span className={'mr-50 cursor-pointer'}>In Progress (3)</span>
                    <span className={'mr-50 cursor-pointer'}>Saved (2)</span>
                    <span className={'mr-50 cursor-pointer'}>Self Assessment Modules (29)</span>
                    <span className={'mr-50 cursor-pointer'}>Lectures (8)</span>
                    <span className={'mr-50 cursor-pointer'}>Quizzes (12)</span>
                </div>
                <Scrollbars
                    className="test-set-items-container"
                    autoHide
                    autoHideDuration={100}
                >
                    <div className={'test-set-items'}>
                        {
                            modalityList.length > 0 && modalityList[selectedModalityIndex].test_sets.map((v) => <TestSetItem key={v.id} data={v}/>)
                        }
                    </div>
                </Scrollbars>
            </div>
            {/*<TestSetModal />*/}
        </div>
    )
}

export default Home;