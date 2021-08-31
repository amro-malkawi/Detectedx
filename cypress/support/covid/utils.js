import { clickSubmit, selectCovidConfidence, selectTestCaseAt, waitLinearProgressBar } from "../common/functions"

export function selectCovidConfidences() {
    selectCovidConfidence(1)
    selectCovidConfidence(2)
    selectCovidConfidence(3)
    selectCovidConfidence(4)
    selectCovidConfidence(5)
}
export function makeCorrectAnswer() {
    const positiveCovid19Cases = [2,4,5,8]
    for (let index = 0; index < positiveCovid19Cases.length; index++) {
        const element = positiveCovid19Cases[index];
        selectTestCaseAt(element)
        waitLinearProgressBar()
        selectCovidConfidences()
        if (index === positiveCovid19Cases.length - 1) {
            clickSubmit()
        }
    }
}