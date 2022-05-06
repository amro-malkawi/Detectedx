import React, {useState, useEffect} from 'react';
import {Button, Tooltip} from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import {Scrollbars} from 'react-custom-scrollbars';
import classNames from 'classnames';
import {useDispatch} from "react-redux";
import QueryString from 'query-string';
import * as selectors from "Selectors";
import {useHistory, useLocation} from "react-router-dom";
import {setUserCompletedCount, setUserCompletedPoint} from 'Actions';
import TestSetItem from "./TestSetItem";
import TestSetModal from './TestSetModal';
import * as Apis from 'Api';

const filterList = [
    {id: 'inProgress', label: 'In Progress', needLogin: true, valKey: 'inProgressCount'},
    {id: 'saved', label: 'Saved', needLogin: true, valKey: 'savedCount'},
    {id: 'sam', label: 'Self Assessment Modules', needLogin: false, valKey: 'samCount'},
    {id: 'lecture', label: 'Lecture', needLogin: false, valKey: 'lectureCount'},
    {id: 'quizzes', label: 'Quizzes', needLogin: false, valKey: 'quizCount'},
]

function Home() {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const [modalityList, setModalityList] = useState([]);
    const [filter, setFilter] = useState(''); // inProgress, saved, sam, lecture, quizzes
    const [testSetList, setTestSetList] = useState([]);

    const [categoryObj, setCategoryObj] = useState([]);
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [selectedTestSet, setSelectedTestSet] = useState(null);
    const [filterValues, setFilterValues] = useState({inProgressCount: 0, savedCount: 0, samCount: 0, lectureCount: 0, quizCount: 0, presentationCount: 0});

    useEffect(() => {
    }, []);

    useEffect(() => {
        const param = QueryString.parse(location.search);
        getData(param.search);
    }, [location, isLogin]);

    useEffect(() => {
        calcCounts();
    }, [selectedCategoryList]);

    const getData = (searchText) => {
        let completed = 0, completedPoint = 0;
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
                        completedPoint += t.test_set_point;
                    }
                }
                if (t.bookedTestSet) {
                    t.filterKeys.push('saved');
                }
                if (modalityInfo.modality_type === 'quiz') {
                    t.filterKeys.push('quizzes');
                } else if (modalityInfo.modality_type === 'video_lecture' || modalityInfo.modality_type === 'presentations') {
                    t.filterKeys.push('lecture');
                } else {
                    t.filterKeys.push('sam');
                }

                t.is3D = (['BreastED - DBT 3D', 'LungED', 'CHEST CT', 'GE 3D'].indexOf(modalityInfo.name) !== -1);
            });

            setModalityList(currentTestSets.modalityList);
            setTestSetList(currentTestSets.testSetList);
            setCategoryObj(categories);
            calcCounts(currentTestSets.modalityList, currentTestSets.testSetList);
            dispatch(setUserCompletedCount(completed));
            dispatch(setUserCompletedPoint(completedPoint));
        });
    }

    const calcCounts = (modalities, testSets) => {
        if (modalities === undefined) modalities = modalityList;
        if (testSets === undefined) testSets = testSetList;
        let inProgress = 0, saved = 0, sam = 0, lecture = 0, quiz = 0, presentation = 0;

        let showList = testSets.filter((v) => (
            selectedCategoryList.length === 0 ||
            selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1
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
            } else if (modalityInfo.modality_type === 'video_lecture' || modalityInfo.modality_type === 'presentations') {
                lecture++;
            } else {
                sam++;
            }
        });
        setFilterValues({
            inProgressCount: inProgress,
            savedCount: saved,
            samCount: sam,
            lectureCount: lecture,
            quizCount: quiz,
            presentationCount: presentation,
        });
    }

    const onCategoryExpand = (categoryLabel, parentIndex) => {
        console.log(categoryLabel, parentIndex);
        const newCategoryObj = [...categoryObj];
        if(parentIndex === undefined) {
            // root category
            const i = newCategoryObj.findIndex((v) => v.label === categoryLabel);
            if(i !== -1) newCategoryObj[i].expand = newCategoryObj[i].expand === undefined ? true : !newCategoryObj[i].expand;
        } else {
            // child category
            const i = newCategoryObj[parentIndex].options.findIndex((v) => v.label === categoryLabel);
            if(i !== -1) newCategoryObj[parentIndex].options[i].expand = newCategoryObj[parentIndex].options[i].expand === undefined ? true : !newCategoryObj[parentIndex].options[i].expand;
        }
        setCategoryObj(newCategoryObj);
    }

    const onSelectCategory = (categoryId) => {
        const i = selectedCategoryList.indexOf(categoryId);

        if (i === -1) {
            setSelectedCategoryList([...selectedCategoryList, categoryId]);
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

    const renderCategoryItem = (subCategory) => {
        const selected = selectedCategoryList.indexOf(subCategory.id) !== -1;
        return (
            <div key={subCategory.label}>
                <Button className={classNames('category-item sub-item', {active: selected})} onClick={() => onSelectCategory(subCategory.id)}>
                    <i className={classNames('zmdi fs-23', (selected ? 'zmdi-check' : 'zmdi-close'))}/>
                    <span className={'fs-18'}>{subCategory.label}</span>
                </Button>
                {
                    subCategory.options && subCategory.options.map((v, i) => renderCategoryItem(subCategory, v))
                }
            </div>
        )
    }

    const renderCategories = (category, selfIndex, parentIndex) => {
        return (
            <div key={category.label}>
                <div>
                    <Button className={'category-item'} onClick={() => onCategoryExpand(category.label, parentIndex)}>
                        <i className={classNames('zmdi fs-23', (category.expand ? 'zmdi-chevron-down' : 'zmdi-chevron-right'))}/>
                        <span className={'fs-18'}>{category.label}</span>
                    </Button>
                </div>
                <div className={'pl-3'}>
                    {
                        (category.options && category.expand) && category.options.map((v, i) => (v.options ? renderCategories(v, i, selfIndex) : renderCategoryItem(v)))
                    }
                </div>
            </div>
        )
    }

    const renderTestSetList = () => {
        if (modalityList.length === 0) return null;
        let showList = testSetList.filter((v) => (
            selectedCategoryList.length === 0 ||
            (selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1)
        ));
        showList.forEach(((v) => console.log(v.test_set_category)))
        if (filter !== '') {
            showList = showList.filter((v) => v.filterKeys.indexOf(filter) !== -1);
        }
        const normalList = [], completedList = [], enterpriseList = [];
        showList.forEach((v) => {
           if(v.filterKeys.indexOf('completed') !== -1) {
               completedList.push(v);
           } else if (v.enterpriseTestSet) {
               enterpriseList.push(v);
           } else {
               normalList.push(v);
           }
        });
        return (
            <Scrollbars
                className="test-set-items-container"
                autoHide
                autoHideDuration={100}
            >
                <div className={'test-set-items'}>
                    {
                        normalList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => setSelectedTestSet(v)}/>)
                    }
                </div>
                {
                    enterpriseList.length > 0 &&
                    <React.Fragment>
                        <div className={'fs-23 mb-2'} style={{marginTop: 70}}>Enterprise Access</div>
                        <div className={'test-set-items'}>
                            {
                                enterpriseList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => setSelectedTestSet(v)}/>)
                            }
                        </div>
                    </React.Fragment>
                }
                {(completedList.length > 0 && normalList.length > 0) && <div className={'fs-23 mb-2'} style={{marginTop: 70}}>Completed</div>}
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
                <div className={'d-flex flex-row align-items-end mb-30'}>
                    <span className={'fs-23'}>Categories</span>
                    <Tooltip title={'Clear'}>
                        <div className={'ml-10 cursor-pointer text-primary1'} onClick={() => setSelectedCategoryList([])}>
                            <DeleteOutlineRoundedIcon fontSize={'small'} />
                        </div>
                    </Tooltip>
                </div>
                <Scrollbars
                    className="main-categories"
                    autoHide
                    autoHideDuration={100}
                >
                    {
                        categoryObj.map((c, i) => renderCategories(c, i))
                    }
                </Scrollbars>
            </div>
            <div className={'test-set-content'}>
                <div className={'test-set-top-filter'}>
                    {
                        filterList.filter((f) => (!isLogin ? !f.needLogin : true)).map((f) => (
                            <span
                                key={f.id}
                                className={classNames('mr-50 cursor-pointer mb-10', {'text-primary1 text-underline': f.id === filter})}
                                onClick={() => onChangeFilter(f)}
                            >
                                {f.label}({filterValues[f.valKey]})
                            </span>
                        ))
                    }
                </div>
                <div className={'mobile-filter-bar'}>
                    dasdfasdfasdf
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