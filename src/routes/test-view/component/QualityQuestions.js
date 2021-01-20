import React, {Component} from "react";

export default class QualityQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: [
                {
                    id: 'b097a950-1959-4389-a07f-28d668aac680',
                    text: 'All breast imaged',
                    child: ['RCC', 'LCC', 'RMLO', 'LMLO']
                },
                {
                    id: '14ae3213-8fb5-4e0a-8a29-b48f3b4440fe',
                    text: 'Nipple in profile',
                    child: ['RCC', 'LCC', 'RMLO', 'LMLO']
                },
                {
                    id: 'a1806111-15b5-475c-90e7-dfa2ae684f9f',
                    text: 'No: skin folds, movement etc',
                    child: ['RCC', 'LCC', 'RMLO', 'LMLO']
                },
                {
                    id: '3de5014b-3a0a-4016-bd3d-71136d491311',
                    text: 'Nipple in midline of breast and centre of image',
                    child: ['RCC', 'LCC']
                },
                {
                    id: 'd318e701-8744-44e0-9c3e-02b440b48456',
                    text: 'Length of posterior nipple line PNL within 1cm of MLO PNL measurement',
                    child: ['RCC', 'LCC']
                },
                {
                    id: '87c94d33-d3a0-4277-b838-a9b7aa5c9fc7',
                    text: 'Pectoral muscle down to the posterior nipple line, PNL',
                    child: ['RMLO', 'LMLO']
                },
                {
                    id: '28a22273-dd75-4693-afd3-6613b0421a04',
                    text: 'Good width of pectoral muscle',
                    child: ['RMLO', 'LMLO']
                },
                {
                    id: 'a4ee3a08-65fd-45a7-964b-78c36f4a1b0e',
                    text: 'Inframammary angle well demonstrated',
                    child: ['RMLO', 'LMLO']
                },
                {
                    id: '9541cdc2-00d9-4ab3-9beb-d331ae291bc2',
                    text: 'Overall Symmetry',
                    child: ['CC', 'MLO']
                },
            ],
            selectedValue: {},
        }
    }

    renderChildItem(value, index) {
        return (
            <div key={index} className={'question-number'}>
                {value}
                <div className={'yellow-circle'} />
                <div className={'red-circle'} />
            </div>
        )
    }

    renderChildQuestion(title, index) {
        return (
            <div key={index} className={'question-child'}>
                <span>{title}</span>
                <div className={'question-number-container'}>
                    {
                        [1, 2, 3].map((v, i) => this.renderChildItem(v, i))
                    }
                </div>
            </div>
        )
    }

    renderQuestion(questionObj, i) {
        return (
            <div key={questionObj.id} className={'quality-question'}>
                <div className={'question-title'}>
                    <div><i className={'zmdi zmdi-forward zmdi-hc-rotate-90'}/></div>
                    <span>{questionObj.text}</span>
                </div>
                <div className={'question-child-container'}>
                {
                    questionObj.child.map((v, i) => this.renderChildQuestion(v, i))
                }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={'quality-question-container'}>
                {this.state.question.map((v, i) => this.renderQuestion(v, i))}
            </div>
        )
    }
}