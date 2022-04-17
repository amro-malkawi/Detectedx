import React, {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import {Scrollbars} from 'react-custom-scrollbars';
import classNames from 'classnames';
import {useDispatch} from "react-redux";
import QueryString from 'query-string';
import * as selectors from "Selectors";
import {useHistory, useLocation} from "react-router-dom";
import {setUserCompletedCount} from 'Actions';
import TestSetItem from "./TestSetItem";
import TestSetModal from './TestSetModal';
import * as Apis from 'Api';
import {testSetsCategories} from "Api";


const filterList = [
    {id: 'sam', label: 'Self Assessment Modules', needLogin: false, valKey: 'samCount'},
    {id: 'lecture', label: 'Lecture', needLogin: false, valKey: 'lectureCount'},
    {id: 'quizzes', label: 'Quizzes', needLogin: false, valKey: 'quizCount'},
    {id: 'inProgress', label: 'In Progress', needLogin: true, valKey: 'inProgressCount'},
    {id: 'saved', label: 'Saved', needLogin: true, valKey: 'savedCount'},
]

function Home() {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const [modalityList, setModalityList] = useState([]);
    const [filter, setFilter] = useState(''); // inProgress, saved, sam, lecture, quizzes
    const [testSetList, setTestSetList] = useState([]);

    const [categoryObj, setCategoryObj] = useState({});
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [selectedTestSet, setSelectedTestSet] = useState(null);
    const [filterValues, setFilterValues] = useState({inProgressCount: 0, savedCount: 0, samCount: 0, lectureCount: 0, quizCount: 0});

    useEffect(() => {
    }, []);

    useEffect(() => {
        const param = QueryString.parse(location.search);
        getData(param.search);
    }, [location]);

    useEffect(() => {
        calcCounts();
    }, [selectedCategoryList]);

    const getData = (searchText) => {
        let completed = 0;
        Promise.all([
            Apis.currentTestSets(searchText),
            Apis.testSetsCategories(),
        ]).then(([currentTestSets, categories]) => {
            currentTestSets.testSetList.forEach((t) => {
                const modalityInfo = currentTestSets.modalityList.find((m) => m.id === t.modality_id);
                t.modalityInfo = modalityInfo;
                t.filterKeys = [];
                if (isLogin) {
                    if (t.attempts.some((a) => !a.complete)) {
                        t.filterKeys.push('inProgress');
                    }
                    if (t.attempts.some((a) => a.complete)) {
                        t.filterKeys.push('completed');
                        completed++;
                    }
                }
                if (t.bookedTestSet) {
                    t.filterKeys.push('saved');
                }
                if (modalityInfo.modality_type === 'quiz') {
                    t.filterKeys.push('quizzes');
                } else if (modalityInfo.modality_type === 'video_lecture') {
                    t.filterKeys.push('lecture');
                } else if (modalityInfo.modality_type === 'presentations') {

                } else {
                    t.filterKeys.push('sam');
                }
            });

            setModalityList(currentTestSets.modalityList);
            setTestSetList(currentTestSets.testSetList);
            setCategoryObj(categories);
            calcCounts(currentTestSets.modalityList, currentTestSets.testSetList);
            dispatch(setUserCompletedCount(completed));
        });
    }

    const calcCounts = (modalities, testSets) => {
        if (modalities === undefined) modalities = modalityList;
        if (testSets === undefined) testSets = testSetList;
        let inProgress = 0, saved = 0, sam = 0, lecture = 0, quiz = 0;
        const showList = testSets.filter((v) => (
            selectedCategoryList.length === 0 ||
            selectedCategoryList.findIndex((c) => (v.test_set_category === c.category && v.test_set_sub_category === c.subCategory)) !== -1
        ));
        showList.forEach((t) => {
            const modalityInfo = modalities.find((m) => m.id === t.modality_id);
            if (isLogin) {
                if (t.attempts.some((a) => !a.complete)) {
                    inProgress++;
                }
                if (t.attempts.some((a) => a.complete)) {
                }
            }
            if (t.bookedTestSet) {
                saved++;
            }
            if (modalityInfo.modality_type === 'quiz') {
                quiz++;
            } else if (modalityInfo.modality_type === 'video_lecture') {
                lecture++;
            } else if (modalityInfo.modality_type === 'presentations') {

            } else {
                sam++;
            }
        });
        setFilterValues({
            inProgressCount: inProgress,
            savedCount: saved,
            samCount: sam,
            lectureCount: lecture,
            quizCount: quiz
        });
    }

    const onSelectCategory = (category, subCategory) => {
        const i = selectedCategoryList.findIndex((v) => (v.category === category && v.subCategory === subCategory));

        if (i === -1) {
            setSelectedCategoryList([...selectedCategoryList, {category, subCategory}]);
        } else {
            selectedCategoryList.splice(i, 1);
            setSelectedCategoryList([...selectedCategoryList]);
        }
    }

    const onChangeFilter = (val) => {
        if (filter === val.id) {
            setFilter('');
        } else {
            setFilter(val.id);
        }
    }

    const renderCategoryItem = (category, subCategory) => {
        const selected = selectedCategoryList.findIndex((v) => (v.category === category && v.subCategory === subCategory)) !== -1;
        return (
            <div className={'pl-3'}>
                <Button key={subCategory} className={classNames('modality-name-item', {active: selected})} onClick={() => onSelectCategory(category, subCategory)}>
                    <i className={classNames('zmdi fs-23', (selected ? 'zmdi-check' : 'zmdi-close'))}/>
                    <span className={classNames({'fs-18': subCategory.length < 20}, {'fs-16': subCategory.length >= 20})}>{subCategory}</span>
                </Button>
            </div>
        )
    }

    const renderCategories = (category) => {
        return (
            <div key={category}>
                <div>
                    <div className={'modality-name-item'}>
                        <span className={'fs-18'}>{category}</span>
                    </div>
                </div>
                {
                    categoryObj[category].map((v, i) => renderCategoryItem(category, v))
                }
            </div>
        )
    }

    const renderTestSetList = () => {
        if (modalityList.length === 0) return null;
        let showList = testSetList.filter((v) => (
            selectedCategoryList.length === 0 ||
            selectedCategoryList.findIndex((c) => (v.test_set_category === c.category && v.test_set_sub_category === c.subCategory)) !== -1
        ));
        if (filter !== '') {
            showList = showList.filter((v) => v.filterKeys.indexOf(filter) !== -1);
        }
        const completedList = showList.filter((v) => v.filterKeys.indexOf('completed') !== -1);
        showList = showList.filter((v) => v.filterKeys.indexOf('completed') === -1);
        return (
            <Scrollbars
                className="test-set-items-container"
                autoHide
                autoHideDuration={100}
            >
                <div className={'test-set-items'}>
                    {
                        showList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => setSelectedTestSet(v)}/>)
                    }
                </div>
                {(completedList.length > 0 && showList.length > 0) && <div className={'fs-23 mb-2'} style={{marginTop: 70}}>Completed</div>}
                {
                    completedList.length > 0 &&
                    <div className={'test-set-items'}>
                        {
                            completedList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => setSelectedTestSet(v)}/>)
                        }
                    </div>
                }
            </Scrollbars>
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
                    {
                        Object.keys(categoryObj).map((c) => renderCategories(c))
                    }
                </Scrollbars>
            </div>
            <div className={'test-set-content'}>
                <div className={'d-flex flex-row fs-23 mb-30'}>
                    {
                        filterList.filter((f) => (!isLogin ? !f.needLogin : true)).map((f) => (
                            <span
                                key={f.id}
                                className={classNames('mr-50 cursor-pointer', {'text-primary1 text-underline': f.id === filter})}
                                onClick={() => onChangeFilter(f)}
                            >
                                {f.label}({filterValues[f.valKey]})
                            </span>
                        ))
                    }
                </div>
                {
                    renderTestSetList()
                }
            </div>
            {
                selectedTestSet && <TestSetModal data={selectedTestSet} onClose={() => {
                    setSelectedTestSet(null);
                    calcCounts();
                }}/>
            }
        </div>
    )
}

export default Home;