import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookie = new Cookies();

export default axios.create({
    baseURL: 'http://reactify.theironnetwork.org/data/',
    timeout: 15000
});

export const apiHost = window.location.protocol + '//' + (window.location.hostname === 'localhost' ? 'localhost:3000' : window.location.hostname);
    // window.location.hostname.split('.')[0].split('-')[0] + '-api' + window.location.hostname.substr(window.location.hostname.split('.')[0].length));
export const apiAddress = apiHost + '/api/';

const instance = axios.create({
    baseURL: apiAddress,
    timeout: 20000
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 && error.request.responseURL.indexOf('api/users/login') === -1) {
        cookie.remove('user_id', {path: '/'});
        cookie.remove('access_token', {path: '/'});
        window.location.reload();
    }
    throw error;
});

export function getAccessToken() {
    return cookie.get("access_token");
}

export function login(email, password) {
    const url = '/users/login';
    const req = {
        email,
        password
    };
    return instance.post(url, req).then((response) => response.data);
}

export function logout() {
    const url = '/users/logout?access_token=' + getAccessToken();
    return instance.post(url, {}).then((response) => response.data);
}

export function singUp(email, firstName, lastName, password) {
    const url = '/users';
    const req = {
        email,
        first_name: firstName,
        last_name: lastName,
        password
    };
    return instance.post(url, req).then((response) => response.data);
}

export function changePassword(curPass, newPass) {
    let url = '/users/change-password?access_token=' + getAccessToken();
    const req = {
        oldPassword: curPass,
        newPassword: newPass
    };
    return instance.post(url, req).then((response) => response.data);
}

export function checkEmailStatus(id) {
    const url = '/users/' + id + '/email-status';
    return instance.get(url).then((response) => response.data);
}

export function userVerify(id) {
    const url = '/users/' + id + '/verify';
    return instance.post(url, {}).then((response) => response.data);
}

export function userConfirm(id, token) {
    const url = '/users/confirm?uid=' + id + '&token=' + token;
    return instance.get(url, ).then((response) => response.data);
}

export function forgotPassword(email) {
    const url = '/users/reset-password';
    return instance.post(url, {email}).then((response) => response.data);
}

/**
 * user operation
 */
export function userList(page) {
    let url = '/users?access_token=' + getAccessToken();
    url += page !== undefined ? "&page=" + page : '';
    return instance.get(url).then((response) => response.data);
}

export function userAdd(data) {
    const url = '/users?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function userUpdate(data) {
    const url = '/users/update-info?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.post(url, data).then((response) => response.data);
}

export function userDelete(id) {
    const url = '/users/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function userInfo() {
    let url = '/users/info?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}


/**
 * User positions functions
 */
export function userPositions() {
    let url = '/user_positions?access_token=' + getAccessToken() + '&filter=' + encodeURI(JSON.stringify({order: 'position ASC'}));
    return instance.get(url).then((response) => response.data);
}

/**
 * User interest functions
 */
export function userInterests() {
    let url = '/user_interests?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * User placeOfWork functions
 */
export function userPlaceOfWorks() {
    let url = '/user_placeofworks?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * test sets operation
 */

export function testSetsList(page) {
    let url = '/test_sets?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += '&filter=' + encodeURI('{"include": [{"relation": "modalities"}]}') + "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function testSetsAdd(data) {
    const url = '/test_sets?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function testSetsUpdate(id, data) {
    const url = '/test_sets/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function testSetsDelete(id) {
    const url = '/test_sets/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function testSetsInfo(id) {
    const url = '/test_sets/' + id + '?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function testSetsModality(id) {
    const url = '/test_sets/' + id + '/modalities?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function testSetsCases(id) {
    const url = '/test_sets/' + id + '/test_set_cases?access_token=' + getAccessToken() + '&filter=' + encodeURI('{"order": "position ASC"}');
    return instance.get(url).then((response) => response.data);
}

export function postTestSetsCases(id) {
    const url = '/test_sets/' + id + '/post_test_set_cases?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * modalities operation
 */

export function modalitiesList(page) {
    let url = '/modalities?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function modalitiesAdd(data) {
    const url = '/modalities?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function modalitiesUpdate(id, data) {
    const url = '/modalities/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function modalitiesDelete(id) {
    const url = '/modalities/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

/**
 * test_set_cases operation
 */

export function testSetCasesList(page) {
    let url = '/test_set_cases?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += '&filter=' + encodeURI('{"include": [{"relation": "test_sets"}, {"relation": "test_cases"}]}') + "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function testSetCasesAdd(data) {
    const url = '/test_set_cases?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function testSetCasesUpdate(id, data) {
    const url = '/test_set_cases/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function testSetCasesDelete(id) {
    const url = '/test_set_cases/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

/**
 * test cases operation
 */

export function testCasesList(page) {
    let url = '/test_cases?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += '&filter=' + encodeURI('{"include": [{"relation": "modalities"}]}') + "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function testCasesAdd(data) {
    const url = '/test_cases?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function testCasesUpdate(id, data) {
    const url = '/test_cases/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function testCasesDelete(id) {
    const url = '/test_cases/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function testCasesInfo(id, filter) {
    let url = '/test_cases/' + id + '?access_token=' + getAccessToken();
    if (filter !== undefined) {
        url += '&filter=' + encodeURI(JSON.stringify(filter));
    }
    return instance.get(url).then((response) => response.data);
}

export function testCasesViewInfo(id) {
    const url = '/test_cases/' + id + '/viewInfo?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function testCasesAnswers(id, attempt_id, isPostTest) {
    const url = '/test_cases/' + id + '/attempt/' + attempt_id + '/answers?is_post_test=' + (isPostTest ? '1' : '0') + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * test-set-assignments operation
 */

export function testSetAssignmentsList(page) {
    let url = '/test_set_assignments?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += '&filter=' + encodeURI('{"include": [{"relation": "user"}, {"relation": "test_sets"}]}') + "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function testSetAssignmentsAdd(data) {
    const url = '/test_set_assignments?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function testSetAssignmentsUpdate(id, data) {
    const url = '/test_set_assignments/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function testSetAssignmentsDelete(id) {
    const url = '/test_set_assignments/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function currentTestSets() {
    const url = '/test_set_assignments/current_set_tests?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * roles operation
 */

export function rolesList(page) {
    let url = '/roles?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += '&filter=' + encodeURI('{"include": [{"relation": "user"}, {"relation": "clinics"}]}') + "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function rolesAdd(data) {
    const url = '/roles?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function rolesUpdate(id, data) {
    const url = '/roles/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function rolesDelete(id) {
    const url = '/roles/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

/**
 * clinics operation
 */

export function clinicsList(page) {
    let url = '/clinics?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function clinicsAdd(data) {
    const url = '/clinics?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function clinicsUpdate(id, data) {
    const url = '/clinics/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function clinicsDelete(id) {
    const url = '/clinics/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

/**
 * metrics operation
 */

export function metricsList(page) {
    let url = '/metrics?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function metricsAdd(data) {
    const url = '/metrics?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function metricsUpdate(id, data) {
    const url = '/metrics/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function metricsDelete(id) {
    const url = '/metrics/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

/**
 * images operation
 */

export function imagesList(page) {
    let url = '/images?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += '&filter=' + encodeURI('{"include": [{"relation": "test_cases"}]}') + "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function imagesAdd(data) {
    const url = '/images?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function imagesUpdate(id, data) {
    const url = '/images/' + id + '?access_token=' + getAccessToken();
    return instance.patch(url, data).then((response) => response.data);
}

export function imagesDelete(id) {
    const url = '/images/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function imagesUrlTemplate(id, stack) {
    const url = '/images/' + id + '/urlTemplate/' + stack + '?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * truths operation
 */

export function truthsList(page) {
    let url = '/truths?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function truthsAdd(data) {
    const url = '/truths?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function truthsUpdate(id, data) {
    const url = '/truths/' + id + '?access_token=' + getAccessToken();
    return instance.patch(url, data).then((response) => response.data);
}

export function truthsDelete(id) {
    const url = '/truths/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function truthsBatchAdd(data) {
    const url = '/truths/batchAdd?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

/**
 * rating-scales operation
 */

export function ratingScalesList(page) {
    let url = '/rating_scales?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function ratingScalesAdd(data) {
    const url = '/rating_scales?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function ratingScalesUpdate(id, data) {
    const url = '/rating_scales/' + id + '?access_token=' + getAccessToken();
    return instance.patch(url, data).then((response) => response.data);
}

export function ratingScalesDelete(id) {
    const url = '/rating_scales/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function ratingScalesBatchAdd(data) {
    const url = '/rating_scales/batchAdd?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

/**
 * lesion-types operation
 */

export function lesionTypesList(page) {
    let url = '/lesion_types?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function lesionTypesAdd(data) {
    const url = '/lesion_types?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function lesionTypesUpdate(id, data) {
    const url = '/lesion_types/' + id + '?access_token=' + getAccessToken();
    return instance.patch(url, data).then((response) => response.data);
}

export function lesionTypesDelete(id) {
    const url = '/lesion_types/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function lesionTypesBatchAdd(data) {
    const url = '/lesion_types/batchAdd?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

/**
 * lesion-types-truths operation
 */

export function lesionTypesTruthsList(page) {
    let url = '/lesion_types_truths?access_token=' + getAccessToken();
    if (page !== undefined) {
        url += "&page=" + page;
    }
    return instance.get(url).then((response) => response.data);
}

export function lesionTypesTruthsAdd(data) {
    const url = '/lesion_types_truths?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function lesionTypesTruthsUpdate(id, data) {
    const url = '/lesion_types_truths/' + id + '?access_token=' + getAccessToken();
    return instance.patch(url, data).then((response) => response.data);
}

export function lesionTypesTruthsDelete(id) {
    const url = '/lesion_types_truths/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function lesionTypesTruthsBatchAdd(data) {
    const url = '/lesion_types_truths/batchAdd?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

/**
 * attempt operation
 */

export function attemptsAdd(data) {
    const url = '/attempts?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function attemptsUpdate(id, data) {
    const url = '/attempts/' + id + '?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.patch(url, data).then((response) => response.data);
}

export function attemptsMoveTestCase(id, testCaseId) {
    const url = '/attempts/' + id + '/move_test_case?test_case_id=' + testCaseId + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsComplete(id, monitorWidth, monitorHeight) {
    const url = '/attempts/' + id + '/complete?monitor_width=' + monitorWidth + '&monitor_height=' + monitorHeight + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsPostTestComplete(id) {
    const url = '/attempts/' + id + '/post_test_complete?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsDetail(id, testCaseId) {
    const url = '/attempts/' + id + '/detail/?test_case_id=' + testCaseId + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsCompletedList(test_set_id) {
    const url = '/attempts/complete_list?test_set_id=' + test_set_id + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsQuestionnaire(id) {
    const url = '/attempts/' + id + '/questionnaire/?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsQuestionnaireAnswer(id, data, type) {
    const url = '/attempts/' + id + '/questionnaire_answer/?type=' + type + '&access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function attemptsCertificatePdf(id, type) {
    return new Promise(function (resolve, reject) {
        const url = '/attempts/' + id + '/certificate/?type=' + type + '&access_token=' + getAccessToken();
        instance({
            url: url,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.pdf');
            document.body.appendChild(link);
            link.click();
            resolve();
        }).catch((e) => {
            reject(e);
        });
    });
}

export function attemptsPercentile(id) {
    const url = '/attempts/' + id + '/percentile?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsQuality(id, test_case_id, quality) {
    const url = '/attempts/' + id + '/quality?test_case_id=' + test_case_id + '&access_token=' + getAccessToken();
    return instance.post(url, quality).then((response) => response.data);
}

export function attemptsConfirmQuality(id, test_case_id, quality, isAgree, msg) {
    const url = '/attempts/' + id + '/confirm_quality?access_token=' + getAccessToken();
    const data = {
        test_case_id,
        quality,
        isAgree,
        msg
    };
    return instance.post(url, data).then((response) => response.data);
}

export function attemptsSavePostAnswer(id, answer) {
    const url = '/attempts/' + id + '/save_post_answer?&access_token=' + getAccessToken();
    return instance.post(url, {answer}).then((response) => response.data);
}

/**
 * answer operation
 */
export function answersAdd(data) {
    const url = '/answers?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function answersUpdate(data) {
    const url = '/answers/' + data.id + '?access_token=' + getAccessToken();
    return instance.put(url, data).then((response) => response.data);
}

export function answersDelete(id) {
    const url = '/answers/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function answersDeleteAll(imageId, attemptId, testCaseId) {
    const url = '/answers/delete_all?access_token=' + getAccessToken();
    const data = {
        image_id: imageId,
        attempt_id: attemptId,
        test_case_id: testCaseId
    };
    return instance.post(url, data).then((response) => response.data);
}

/**
 * shape opertaion
 */
export function shapeAdd(data) {
    const url = '/shapes?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function shapeUpdate(data) {
    const url = '/shapes/' + data.id + '?access_token=' + getAccessToken();
    return instance.put(url, data).then((response) => response.data);
}

export function shapeDelete(id) {
    const url = '/shapes/' + id + '?access_token=' + getAccessToken();
    return instance.delete(url).then((response) => response.data);
}

export function shapeDeleteAll(imageId, attemptId, testCaseId, type) {
    const url = '/shapes/delete_all?access_token=' + getAccessToken();
    const data = {
        image_id: imageId,
        attempt_id: attemptId,
        test_case_id: testCaseId,
        type: type,
    };
    return instance.post(url, data).then((response) => response.data);
}

/**
 * product plans
 */

export function getProductPlans() {
    const url = '/product_plans/list?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * order opertaion
 */

export function orderChargeCard(planId, token) {
    const url = 'user_orders/charge_card?access_token=' + getAccessToken();
    return instance.post(url, {planId, token}).then((response) => response.data);
}

export function orderPaypalCreatePayment(planId) {
    const url = 'user_orders/paypal_create_payment?access_token=' + getAccessToken();
    return instance.post(url, {planId}).then((response) => response.data);
}

export function orderPaypalExecutePayment(paymentId, payerId, planId) {
    const url = 'user_orders/paypal_execute_payment?access_token=' + getAccessToken();
    return instance.post(url, {paymentId, payerId, planId}).then((response) => response.data);
}

