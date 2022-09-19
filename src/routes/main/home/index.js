import React, {useState, useEffect, useRef} from 'react';
import {Button, IconButton, Tooltip} from '@material-ui/core';
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
    {id: 'lecture', label: 'Lecture Series', needLogin: false, valKey: 'lectureCount'},
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
    const searchTextRef = useRef();
    const [modalityList, setModalityList] = useState([]);
    const [filter, setFilter] = useState(''); // inProgress, saved, sam, lecture, quizzes
    const [testSetList, setTestSetList] = useState([]);
    const [showMobileCategoryType, setShowMobileCategoryType] = useState(null);
    const [categoryObj, setCategoryObj] = useState([]);
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [selectedTestSet, setSelectedTestSet] = useState(null);
    const [filterValues, setFilterValues] = useState({inProgressCount: 0, savedCount: 0, samCount: 0, lectureCount: 0, quizCount: 0, presentationCount: 0, viewerCount: 0});

    useEffect(() => {
        // history.replace({pathname: location.pathname});
        const param = QueryString.parse(location.search);
        if (param.filter) {
            setFilter(param.filter);
        }
        if (param.categories) {
            setSelectedCategoryList(param.categories.split(','));
        }
    }, []);

    useEffect(() => {
        // if (location.hash !== '#modal' && selectedTestSet) {
        //     setSelectedTestSet(null);
        // }
        const param = QueryString.parse(location.search);
        if(!param.selectedId) setSelectedTestSet(null);
        if(param.search !== searchTextRef.current) {
            searchTextRef.current = param.search;
            getData(param.search);
        }
    }, [location]);

    useEffect(() => {
        const param = QueryString.parse(location.search);
        getData(param.search);
    }, [isLogin]);

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
                if (t.tileType === 'series') {
                    t.isSeriesSameModality = t.seriesTestSets.every((v) => v.modality_id === t.seriesTestSets[0].modality_id);
                    modalityInfo = currentTestSets.modalityList.find((m) => m.id === t.seriesTestSets[0].modality_id);
                    t.modalityInfo = modalityInfo;
                    t.seriesTestSets.forEach((v) => {
                        v.modalityInfo = currentTestSets.modalityList.find((m) => m.id === v.modality_id);
                        const {filterKeys, is3D, isComplete} = getFilterKeys(v);
                        v.filterKeys = filterKeys;
                        v.is3D = is3D;
                        if (isComplete) {
                            completed++;
                            completedPoint += v.test_set_point;
                        }
                    });
                } else {
                    modalityInfo = currentTestSets.modalityList.find((m) => m.id === t.modality_id);
                    t.modalityInfo = modalityInfo;
                    const {filterKeys, is3D, isComplete} = getFilterKeys(t);
                    t.filterKeys = filterKeys;
                    t.is3D = is3D;
                    if (isComplete) {
                        completed++;
                        completedPoint += t.test_set_point;
                    }
                }
            });
            setModalityList(currentTestSets.modalityList);
            setTestSetList(currentTestSets.testSetList);
            setCategoryObj(categories);
            const param = QueryString.parse(location.search);
            if(param.selectedId) {
                console.log(param.selectedId, 'param.selectedId')
                const item = currentTestSets.testSetList.find((v) => v.id === param.selectedId);
                if(item) setSelectedTestSet(item);
            }
            calcCounts(currentTestSets.modalityList, currentTestSets.testSetList);
            dispatch(setUserCompletedCount(completed));
            dispatch(setUserCompletedPoint(completedPoint));

            // setSelectedTestSet(currentTestSets.testSetList[2]);
        });
    }

    const getFilterKeys = (t) => {
        const filterKeys = [];
        let isComplete = false;
        if (isLogin && t.tileType !== 'series') {
            if (t.attempts.some((a) => !a.complete)) {
                filterKeys.push('inProgress');
            }
            if (t.attempts.some((a) => a.complete)) {
                filterKeys.push('completed');
                isComplete = true;
            }
        }
        if (t.bookedTestSet) {
            filterKeys.push('saved');
        }
        if (t.modalityInfo.modality_type === 'quiz') {
            filterKeys.push('quizzes');
        } else if (['video_lecture', 'presentations', 'interactive_video'].indexOf(t.modalityInfo.modality_type) !== -1) {
            filterKeys.push('lecture');
        } else if (t.modalityInfo.modality_type === 'viewer') {
            filterKeys.push('imageViewer');
        } else {
            filterKeys.push('sam');
        }
        if (!Array.isArray(filterKeys)) console.log(filterKeys, t)
        const is3D = (['BreastED - DBT 3D', 'LungED', 'CHEST CT', 'GE 3D'].indexOf(t.modalityInfo.name) !== -1);
        return {filterKeys, is3D, isComplete};
    }

    const calcCounts = (modalities, testSets) => {
        if (modalities === undefined) modalities = modalityList;
        if (testSets === undefined) testSets = testSetList;
        let inProgress = 0, saved = 0, sam = 0, lecture = 0, quiz = 0, presentation = 0, viewer = 0;
        const showList = [];
        testSets.forEach((t) => {
            if (t.tileType === 'series') {
                t.seriesTestSets.forEach((v) => {
                    if (selectedCategoryList.length === 0 || selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1) {
                        showList.push(v);
                    }
                })
            } else {
                if (selectedCategoryList.length === 0 || selectedCategoryList.findIndex((c) => (t.test_set_category && t.test_set_category.indexOf(c) !== -1)) !== -1) {
                    showList.push(t);
                }
            }
        });

        showList.forEach((t) => {
            let modalityInfo;
            if (t.tileType === 'series') {
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
            } else if (['video_lecture', 'presentations', 'interactive_video'].indexOf(modalityInfo.modality_type) !== -1) {
                lecture++;
            } else if (modalityInfo.modality_type === 'viewer') {
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

    const onCategoryExpand = (categoryInfo, parentIndex) => {
        const categoryLabel = categoryInfo.label;
        const newCategoryObj = [...categoryObj];
        if (parentIndex === undefined) {
            // root category
            const i = newCategoryObj.findIndex((v) => v.label === categoryLabel);
            if (i !== -1) newCategoryObj[i].expand = newCategoryObj[i].expand === undefined ? true : !newCategoryObj[i].expand;
        } else {
            // child category
            let i = newCategoryObj[parentIndex].options.findIndex((v) => v.label === categoryLabel);
            if (i !== -1) newCategoryObj[parentIndex].options[i].expand = newCategoryObj[parentIndex].options[i].expand === undefined ? true : !newCategoryObj[parentIndex].options[i].expand;
            // add or remove child category
            // onSelectCategory(categoryInfo.id);
        }
        setCategoryObj(newCategoryObj);
    }

    const onSelectCategory = (categoryId) => {
        let i = selectedCategoryList.indexOf(categoryId);
        let newSelected = [...selectedCategoryList];
        if (i === -1) {
            newSelected.push(categoryId);
        } else {
            newSelected.splice(i, 1);
        }

        // remove parent
        i = categoryId.lastIndexOf(' > ');
        const parentId = categoryId.substring(0, i);
        i = newSelected.indexOf(parentId);
        if (i !== -1) {
            newSelected.splice(i, 1);
        }
        // remove child
        newSelected = newSelected.filter((v) => (v === categoryId || v.indexOf(categoryId) !== 0));

        setSelectedCategoryList(newSelected);
        const param = QueryString.parse(location.search);
        param.categories = newSelected.join(',');
        history.replace({pathname: location.pathname, search: QueryString.stringify(param)});
    }

    const onChangeFilter = (val) => {
        const param = QueryString.parse(location.search);
        if (filter === val.id) {
            setFilter('');
            delete param.filter;
        } else {
            setFilter(val.id);
            param.filter = val.id;
        }
        history.replace({pathname: location.pathname, search: QueryString.stringify(param)});
    }

    const onOpenTestSetModal = (value) => {
        setSelectedTestSet(value);
        // if (value) {
        //     history.push({pathname: location.pathname, hash: 'modal', search: location.search});
        // } else {
        //     // history.replace({pathname: location.pathname});
        //     history.goBack();
        // }
        const param = QueryString.parse(location.search);
        if (value) {
            param.selectedId = value.id;
        } else {
            delete param.selectedId;
            // history.replace({pathname: location.pathname});
            // history.goBack();
        }
        history.replace({pathname: location.pathname, search: QueryString.stringify(param)});
    }

    const renderCategoryItem = (subCategory) => {
        const selected = selectedCategoryList.indexOf(subCategory.id) !== -1;
        return (
            <div key={subCategory.label}>
                <Button className={classNames('category-item sub-item', {active: selected})} onClick={() => onSelectCategory(subCategory.id)}>
                    <i className={classNames('zmdi fs-23', (selected ? 'zmdi-check' : 'zmdi-close'))}/>
                    <span className={'fs-17'}>{subCategory.label}</span>
                </Button>
                {
                    subCategory.options && subCategory.options.map((v, i) => renderCategoryItem(subCategory, v))
                }
            </div>
        )
    }

    const renderCategories = (category, selfIndex, parentIndex) => {
        const selected = parentIndex !== undefined && selectedCategoryList.indexOf(category.id) !== -1;
        return (
            <div key={category.label}>
                <div>
                    <Button className={classNames('category-item', {active: selected})}>
                        <IconButton className={'category-expand-btn'} onClick={() => onCategoryExpand(category, parentIndex)}>
                            <i className={classNames('zmdi fs-23', (category.expand ? 'zmdi-chevron-down' : 'zmdi-chevron-right'))}/>
                        </IconButton>
                        <span className={'fs-18 sub-category-item'} onClick={() => parentIndex !== undefined && onSelectCategory(category.id)}>
                            {category.label}
                        </span>
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
                className={classNames('mr-40 cursor-pointer mb-10', {'text-primary1 text-underline': f.id === filter})}
                onClick={() => onChangeFilter(f)}
            >
                {f.label}({filterValues[f.valKey]})
            </span>
        ))
    }

    const renderTestSetList = () => {
        if (modalityList.length === 0) return null;
        const testSets = JSON.parse(JSON.stringify(testSetList));
        const showList = [];

        testSets.forEach((t) => {
            if (t.tileType === 'series') {
                const seriesTestSets = [];
                t.seriesTestSets.some((v) => {
                    if (
                        (selectedCategoryList.length === 0 || selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1) &&
                        (filter === '' || (v.filterKeys && v.filterKeys.indexOf(filter) !== -1))
                    ) {
                        seriesTestSets.push(v);
                    }
                });
                if (seriesTestSets.length > 0) {
                    t.seriesTestSets = seriesTestSets;
                    showList.push(t);
                }
            } else {
                if (
                    (selectedCategoryList.length === 0 || selectedCategoryList.findIndex((c) => (t.test_set_category && t.test_set_category.indexOf(c) !== -1)) !== -1) &&
                    (filter === '' || (t.filterKeys && t.filterKeys.indexOf(filter) !== -1))
                ) {
                    showList.push(t);
                }
            }
        });

        // let showList = testSetList.filter((v) => (
        //     selectedCategoryList.length === 0 ||
        //     (selectedCategoryList.findIndex((c) => (v.test_set_category && v.test_set_category.indexOf(c) !== -1)) !== -1)
        // ));
        // if (filter !== '') {
        //     showList = showList.filter((v) => v.filterKeys && v.filterKeys.indexOf(filter) !== -1);
        // }
        const normalList = [], completedList = [], enterpriseList = [];
        showList.forEach((v) => {
            if (v.filterKeys && v.filterKeys.indexOf('completed') !== -1) {
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