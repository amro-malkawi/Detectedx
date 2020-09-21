import React, {useState} from 'react';
import * as Apis from "Api/index";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import WhiteView from "./WhiteView";
import DarkView from "./DarkView";

export default function (props) {
    return <DarkView props={props}/>
    /*const [loading, setLoading] = useState(true);
    const [modalityType, setModalityType] = useState('');
    function getData() {
        Apis.attemptsDetail(props.match.params.attempt_id).then((result) => {
            setModalityType(result.test_sets.modalities.modality_type);
            setLoading(false);
        }).catch((e) => {

        })
    }
    getData();
    if(loading) {
        return (<RctSectionLoader/>);
    } else {
        return modalityType !== 'volpara' ? <WhiteView props={props} /> : <DarkView props={props}/>
    }*/
}