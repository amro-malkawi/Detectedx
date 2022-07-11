import React, {useState, useEffect} from 'react';
import {Button, Tooltip} from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import FilterListIcon from '@material-ui/icons/FilterList';
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
    {id: 'sam', label: 'Self Assessment Modules', needLogin: false, valKey: 'samCount'},
    {id: 'lecture', label: 'Lectures', needLogin: false, valKey: 'lectureCount'},
    {id: 'quizzes', label: 'Quizzes', needLogin: false, valKey: 'quizCount'},
    {id: 'imageViewer', label: 'Image viewers', needLogin: false, valKey: 'viewerCount'},
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
    const [showMobileCategoryType, setShowMobileCategoryType] = useState(null);
    const [categoryObj, setCategoryObj] = useState([]);
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [selectedTestSet, setSelectedTestSet] = useState(null);
    const [filterValues, setFilterValues] = useState({inProgressCount: 0, savedCount: 0, samCount: 0, lectureCount: 0, quizCount: 0, presentationCount: 0, viewerCount: 0});

    useEffect(() => {
        history.replace({pathname: location.pathname});
    }, []);

    useEffect(() => {
        const param = QueryString.parse(location.search);
        console.log(location.hash)
        if (location.hash !== '#modal' && selectedTestSet) {
            setSelectedTestSet(null);
        }
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
                let modalityInfo;
                if(t.tileType === 'series') {
                    modalityInfo = currentTestSets.modalityList.find((m) => m.id === t.seriesTestSets[0].modality_id);
                    t.modalityInfo = modalityInfo;
                    t.seriesTestSets.forEach((v) => v.modalityInfo = modalityInfo);
                } else {
                    modalityInfo = currentTestSets.modalityList.find((m) => m.id === t.modality_id);
                    t.modalityInfo = modalityInfo;
                }
                t.filterKeys = [];
                if (isLogin && t.tileType !== 'series') {
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
                } else if (modalityInfo.modality_type === 'viewer') {
                    t.filterKeys.push('imageViewer');
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

            // setSelectedTestSet(currentTestSets.testSetList[2]);
        });
    }

    const calcCounts = (modalities, testSets) => {
        if (modalities === undefined) modalities = modalityList;
        if (testSets === undefined) testSets = testSetList;
        let inProgress = 0, saved = 0, sam = 0, lecture = 0, quiz = 0, presentation = 0, viewer = 0;

        let showList = testSets.filter((v) => (
            selectedCategoryList.length === 0 ||
            selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1
        ));

        showList.forEach((t) => {
            let modalityInfo;
            if(t.tileType === 'series') {
                modalityInfo = modalities.find((m) => m.id === t.seriesTestSets[0].modality_id);
            } else {
                modalityInfo = modalities.find((m) => m.id === t.modality_id);
            }
            if (isLogin && t.tileType !== 'series') {
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
            } else if(modalityInfo.modality_type === 'viewer') {
                viewer++;
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
            viewerCount: viewer,
        });
    }

    const onCategoryExpand = (categoryLabel, parentIndex) => {
        const newCategoryObj = [...categoryObj];
        if (parentIndex === undefined) {
            // root category
            const i = newCategoryObj.findIndex((v) => v.label === categoryLabel);
            if (i !== -1) newCategoryObj[i].expand = newCategoryObj[i].expand === undefined ? true : !newCategoryObj[i].expand;
        } else {
            // child category
            const i = newCategoryObj[parentIndex].options.findIndex((v) => v.label === categoryLabel);
            if (i !== -1) newCategoryObj[parentIndex].options[i].expand = newCategoryObj[parentIndex].options[i].expand === undefined ? true : !newCategoryObj[parentIndex].options[i].expand;
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

    const onOpenTestSetModal = (value) => {
        setSelectedTestSet(value);
        if (value) {
            history.push({pathname: location.pathname, hash: 'modal', search: location.search});
        } else {
            // history.replace({pathname: location.pathname});
            history.goBack();
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

    const renderCategory = () => {
        return (
            <Scrollbars
                className=""
                style={{marginBottom: 1}}
                autoHide
                autoHideDuration={100}
            >
                {
                    categoryObj.map((c, i) => renderCategories(c, i))
                }
            </Scrollbars>
        )
    }

    const renderFilter = () => {
        return filterList.filter((f) => (!isLogin ? !f.needLogin : true)).map((f) => (
            <span
                key={f.id}
                className={classNames('mr-50 cursor-pointer mb-10', {'text-primary1 text-underline': f.id === filter})}
                onClick={() => onChangeFilter(f)}
            >
                                {f.label}({filterValues[f.valKey]})
                            </span>
        ))
    }

    const renderTestSetList = () => {
        if (modalityList.length === 0) return null;
        let showList = testSetList.filter((v) => (
            selectedCategoryList.length === 0 ||
            (selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1)
        ));
        if (filter !== '') {
            showList = showList.filter((v) => v.filterKeys.indexOf(filter) !== -1);
        }
        const normalList = [], completedList = [], enterpriseList = [];
        showList.forEach((v) => {
            if (v.filterKeys.indexOf('completed') !== -1) {
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
                style={{marginBottom: 1}}
                autoHide
                autoHideDuration={100}
            >
                {
                    enterpriseList.length > 0 &&
                    <React.Fragment>
                        <div className={'fs-23 mb-2'}>Enterprise Access</div>
                        <div className={'test-set-items'}>
                            {
                                enterpriseList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => onOpenTestSetModal(v)}/>)
                            }
                        </div>
                    </React.Fragment>
                }
                {
                    enterpriseList.length > 0 && <div className={'fs-23 mb-2'} style={{marginTop: 70}}>Library</div>
                }
                <div className={'test-set-items'}>
                    {
                        normalList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => onOpenTestSetModal(v)}/>)
                    }
                </div>
                {(completedList.length > 0 && normalList.length > 0) && <div className={'fs-23 mb-2'} style={{marginTop: 70}}>Completed</div>}
                {
                    completedList.length > 0 &&
                    <div className={'test-set-items'}>
                        {
                            completedList.map((v) => <TestSetItem key={v.id} data={v} onClick={() => onOpenTestSetModal(v)}/>)
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
                            <DeleteOutlineRoundedIcon fontSize={'small'}/>
                        </div>
                    </Tooltip>
                </div>
                {renderCategory()}
            </div>
            <div className={'test-set-content'}>
                <div className={'test-set-top-filter'}>
                    {renderFilter()}
                </div>
                <div className={'mobile-filter-bar'}>
                    <div className={'d-flex flex-row align-items-center cursor-pointer'} onClick={() => setShowMobileCategoryType('category')}>
                        <span className={'fs-17 fw-semi-bold mr-2'}>Categories{selectedCategoryList.length === 0 ? '' : `(${selectedCategoryList.length})`}</span>
                        <i className={'ti ti-angle-down'}/>
                    </div>
                    <div className={'d-flex flex-row align-items-center ml-40 cursor-pointer'} onClick={() => setShowMobileCategoryType('filter')}>
                        <span className={classNames('fs-17 fw-semi-bold mr-2', {'text-underline': filter !== ''})}>Filter</span>
                        <FilterListIcon/>
                    </div>
                    {
                        showMobileCategoryType === 'category' &&
                        <div className={'main-mobile-filter-container'} onClick={() => setShowMobileCategoryType(null)}>
                            <div className={'main-mobile-category-content'} onClick={(e) => e.stopPropagation()}>
                                {renderCategory()}
                            </div>
                        </div>
                    }
                    {
                        showMobileCategoryType === 'filter' &&
                        <div className={'main-mobile-filter-container'} onClick={() => setShowMobileCategoryType(null)}>
                            <div className={'main-mobile-filter-content'} onClick={(e) => e.stopPropagation()}>
                                <div className={'d-flex flex-column '}>
                                    {renderFilter()}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {
                    renderTestSetList()
                }
            </div>
            {
                selectedTestSet &&
                <TestSetModal
                    data={selectedTestSet}
                    onClose={() => {
                        onOpenTestSetModal(null);
                        calcCounts();
                    }}
                />
            }
        </div>
    )
}

export default Home;