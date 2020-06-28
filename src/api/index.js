import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookie = new Cookies();


function getApiHost()
{
    let hostname = window.location.hostname;
    if (
        hostname === 'localhost' ||
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname)
    )
    {
        hostname = hostname + ':3000';
    }
    return window.location.protocol + '//' + hostname;
}

export const apiHost = getApiHost();

export const apiAddress = apiHost + '/api/';

const instance = axios.create({
    baseURL: apiAddress,
    timeout: 40000
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

export function singUp(data) {
    const url = '/users';
    return instance.post(url, data).then((response) => response.data);
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
    const url = '/users/reset';
    return instance.post(url, {email}).then((response) => response.data);
}

export function resetPassword(newPassword, accessToken) {
    const url = '/users/reset-password?access_token=' + accessToken;
    return instance.post(url, {newPassword}).then((response) => response.data);
}

/**
 * user operation
 */

export function userUpdate(data) {
    const url = '/users/update-info?access_token=' + getAccessToken();
    delete data["created_at"];
    delete data["updated_at"];
    return instance.post(url, data).then((response) => response.data);
}

export function userInfo() {
    let url = '/users/info?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}


/**
 * User positions functions
 */
export function userPositions() {
    let url = '/user_positions?filter=' + encodeURI(JSON.stringify({order: 'position ASC'}));
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
    let url = '/user_placeofworks';
    return instance.get(url).then((response) => response.data);
}

/**
 * countries
 */
export function countryList() {
    let url = '/countries?filter=' + encodeURI(JSON.stringify({order: 'country_name ASC'}));
    return instance.get(url).then((response) => response.data);
}

/**
 * test sets operation
 */

export function testSetsCases(id) {
    const url = '/test_sets/' + id + '/test_set_cases?access_token=' + getAccessToken() + '&filter=' + encodeURI('{"order": "position ASC"}');
    return instance.get(url).then((response) => response.data);
}

export function postTestSetsCases(id) {
    const url = '/test_sets/' + id + '/post_test_set_cases?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * test_set_cases operation
 */

/**
 * test cases operation
 */

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

export function currentTestSets() {
    const url = '/test_set_assignments/current_test_sets?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function buyTestSet(test_set_id) {
    const url = '/test_set_assignments/buy_test_set?test_set_id=' + test_set_id +'&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * images operation
 */

export function imagesUrlTemplate(id, stack) {
    const url = '/images/' + id + '/urlTemplate/' + stack + '?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * attempt operation
 */

export function attemptsAdd(data) {
    const url = '/attempts?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
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

export function attemptsSetCovidAnswer(id, test_case_id, rating, answer, is_post_test = false) {
    let url = '/attempts/' + id + '/set_covid_answer?access_token=' + getAccessToken();
    const data = {
        test_case_id,
        rating,
        answer,
        is_post_test
    };
    return instance.post(url, data).then((response) => response.data);
}

export function attepmtsGetCovidAnswer(id, test_case_id, is_post_test) {
    let url = '/attempts/' + id + '/get_covid_answer?test_case_id=' + test_case_id + '&is_post_test=' + is_post_test + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attepmtsGetCovidTruth(id, test_case_id) {
    let url = '/attempts/' + id + '/get_covid_truth?test_case_id=' + test_case_id + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptGetTestCaseComment(id, test_case_id) {
    let url = '/attempts/' + id + '/get_test_case_comment?test_case_id=' + test_case_id + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsSetProgress(id, progress) {
    let url = '/attempts/' + id + '/set_progress?progress=' + progress + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
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
    const url = '/subscription_plans/list?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * order subscriptions
 */

export function orderChargeCard(planId, token) {
    const url = 'user_subscriptions/subscription_charge_card?access_token=' + getAccessToken();
    return instance.post(url, {planId, token}).then((response) => response.data);
}

export function orderPaypalCreateSubscription(planId) {
    const url = 'user_subscriptions/subscription_paypal_create?access_token=' + getAccessToken();
    return instance.post(url, {planId}).then((response) => response.data);
}

export function orderPaypalApprove(paymentInfo, planId) {
    const url = 'user_subscriptions/subscription_paypal_approve?access_token=' + getAccessToken();
    return instance.post(url, {paymentInfo, planId}).then((response) => response.data);
}


export function subscriptionPlanStripe(planId, price, currency, couponCode, token) {
    const url = 'user_subscriptions/plan_stripe?access_token=' + getAccessToken();
    return instance.post(url, {planId, price, currency, couponCode, token}).then((response) => response.data);
}

export function subscriptionPlanPaypalCreate(planId, price, currency, couponCode) {
    const url = 'user_subscriptions/plan_paypal_create?access_token=' + getAccessToken();
    return instance.post(url, {planId, currency, price, couponCode}).then((response) => response.data);
}

export function subscriptionPlanPaypalApprove(planId, price, currency, couponCode, paymentInfo) {
    const url = 'user_subscriptions/plan_paypal_approve?access_token=' + getAccessToken();
    return instance.post(url, {planId, price, currency, couponCode, paymentInfo}).then((response) => response.data);
}

/**
 * user orders
 */
export function orderCreditStripe(price, currency, couponCode, token) {
    const url = 'user_orders/credit_stripe?access_token=' + getAccessToken();
    return instance.post(url, {price, currency, couponCode, token}).then((response) => response.data);
}

export function orderCreditPaypalCreate(price, currency, couponCode) {
    const url = 'user_orders/credit_paypal_create?access_token=' + getAccessToken();
    return instance.post(url, {currency, price, couponCode}).then((response) => response.data);
}

export function orderCreditPaypalApprove(price, currency, couponCode, paymentInfo) {
    const url = 'user_orders/credit_paypal_approve?access_token=' + getAccessToken();
    return instance.post(url, {price, currency, couponCode, paymentInfo}).then((response) => response.data);
}


/**
 * payment_history functions
 */
export function paymentHistoryReceipt(id) {
    let url = '/payment_histories/' + id + '/receipt?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * coupons functions
 */
export function couponInfo(couponCode, type) {
    const url = 'coupons/info?coupon_code=' + couponCode + '&type=' + type + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function couponApplyTestSetCoupon(couponCode) {
    const url = 'coupons/apply_test_set_coupon?coupon_code=' + couponCode + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}