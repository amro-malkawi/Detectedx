import axios from 'axios';
import {Cookies} from 'react-cookie';

const cookie = new Cookies();


function getApiHost() {
    let hostname = window.location.hostname;
    if (
        hostname === 'localhost' ||
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname)
    ) {
        hostname = hostname + ':3000';
    }
    return window.location.protocol + '//' + hostname;
}

export const apiHost = getApiHost();

export const apiAddress = apiHost + '/api/';
export const apiUploadAddress = apiHost + '/upload';

const instance = axios.create({
    baseURL: apiAddress,
    timeout: 40000
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 && error.request.responseURL.indexOf('api/users/login') === -1) {
        // logout status
        cookie.remove('user_id', {path: '/'});
        cookie.remove('access_token', {path: '/'});
        window.location.reload();
    }
    throw error;
});

export function getAccessToken() {
    return cookie.get("access_token");
}

export function getJsonData(url) {
    return instance.get(url).then((response) => response.data);
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

export function userCheckEmail(email) {
    const url = '/users/check_email?email=' + email;
    return instance.get(url).then((response) => response.data);
}

export function signUp(data) {
    const url = '/users/signup';
    return instance.post(url, data).then((response) => response.data);
}

export function userSubscribe(data) {
    const url = '/users/subscribe?access_token=' + getAccessToken();
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
    return instance.get(url,).then((response) => response.data);
}

export function forgotPassword(email) {
    const url = '/users/reset';
    return instance.post(url, {email}).then((response) => response.data);
}

export function resetPassword(newPassword, accessToken) {
    const url = '/users/reset-password?access_token=' + accessToken;
    return instance.post(url, {newPassword}).then((response) => response.data);
}

export function userConfirmPassword(password) {
    const url = '/users/confirm_password?access_token=' + getAccessToken();
    return instance.post(url, {password}).then((response) => response.data);
}

export function userDeleteProfile() {
    const url = '/users/delete_profile?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
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

export function testSetsCaseList(id, isPost) {
    const url = '/test_sets/' + id + '/test_case_list?is_post=' + isPost + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function testSetRecentlyCompleted() {
    const url = '/test_sets/recently_completed?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function testSetsCategories() {
    const url = '/test_sets/categories?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function testSetsCompletedPdf() {
    const url = '/test_sets/export-completed?access_token=' + getAccessToken();
    return new Promise(function (resolve, reject) {
        instance({
            url: url,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Completed modules.pdf`);
            document.body.appendChild(link);
            link.click();
            resolve();
        }).catch((e) => {
            return e.response.data.text();
        }).then((errorMsg) => {
            reject({response: {data: JSON.parse(errorMsg)}});
        }).catch((e) => {
            reject(e);
        });
    });
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

export function currentTestSets(searchText) {
    let url = `/test_set_assignments/current_test_sets?access_token=` + getAccessToken();
    if (searchText) {
        url += `&search=${searchText}`;
    }
    return instance.get(url).then((response) => response.data);
}

/**
 * attempt operation
 */

export function attemptsStart(test_set_id, attemptSubType) {
    let url = '/attempts/start?test_set_id=' + test_set_id + '&access_token=' + getAccessToken();
    if (attemptSubType && attemptSubType.length > 0) {
        url = url + '&sub_type=' + attemptSubType;
    }
    return instance.get(url).then((response) => response.data);
}

export function attemptsMoveTestCase(id, testCaseId) {
    const url = '/attempts/' + id + '/move_test_case?test_case_id=' + testCaseId + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsFinishTest(id, monitorWidth, monitorHeight) {
    const url = '/attempts/' + id + '/finish_test?monitor_width=' + monitorWidth + '&monitor_height=' + monitorHeight + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsPostTestFinish(id) {
    const url = '/attempts/' + id + '/post_test_finish?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsPostTestReattempt(id) {
    const url = '/attempts/' + id + '/post_test_reattempt?access_token=' + getAccessToken();
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

export function attemptsCertificatePdf(id, type, email, testSetName) {
    const url = '/attempts/' + id + '/certificate?type=' + type + '&email=' + email + '&access_token=' + getAccessToken();
    if (email && email.length > 0) {
        return instance.get(url).then((response) => response.data);
    } else {
        return new Promise(function (resolve, reject) {
            instance({
                url: url,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Certificate of ${testSetName}.pdf`);
                document.body.appendChild(link);
                link.click();
                resolve();
            }).catch((e) => {
                return e.response.data.text();
            }).then((errorMsg) => {
                reject({response: {data: JSON.parse(errorMsg)}});
            }).catch((e) => {
                reject(e);
            });
        });
    }
}

export function attemptsScorePdf(id, email, testSetName) {
    const url = '/attempts/' + id + '/scorepdf?email=' + email + '&access_token=' + getAccessToken();
    if (email && email.length > 0) {
        return instance.get(url).then((response) => response.data);
    } else {
        return new Promise(function (resolve, reject) {
            instance({
                url: url,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Score sheet of ${testSetName}.pdf`);
                document.body.appendChild(link);
                link.click();
                resolve();
            }).catch((e) => {
                reject(e);
            });
        });
    }
}

export function attemptsDensity(id, test_case_id, density) {
    const url = '/attempts/' + id + '/set_density?test_case_id=' + test_case_id + '&density=' + density + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
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

export function attemptGetTestCaseComment(id, test_case_id, is_post_test) {
    let url = '/attempts/' + id + '/get_test_case_comment?test_case_id=' + test_case_id + '&is_post_test=' + is_post_test + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsSetProgress(id, progress) {
    let url = '/attempts/' + id + '/set_progress?progress=' + progress + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsStartVideo(id) {
    let url = '/attempts/' + id + '/start_video?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsAssignFromGuest(id) {
    let url = '/attempts/' + id + '/assign_from_guest?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function attemptsViewerReset(id) {
    let url = '/attempts/' + id + '/viewer_reset?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * score operation
 */
export function attemptsPercentile(attempt_id, score_type, user_position) {
    const url = `/scores/attempt_percentile?attempt_id=${attempt_id}&score_type=${score_type}&position=${user_position}&access_token=` + getAccessToken();
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

// export function getProductPlans() {
//     const url = '/subscription_plans/list?access_token=' + getAccessToken();
//     return instance.get(url).then((response) => response.data);
// }

/**
 * order subscriptions
 */
// export function subscriptionPlanFree(planId, price, currency, couponCode) {
//     const url = 'user_subscriptions/plan_free?access_token=' + getAccessToken();
//     return instance.post(url, {planId, price, currency, couponCode}).then((response) => response.data);
// }
//
// export function subscriptionPlanStripe(planId, price, currency, couponCode, token) {
//     const url = 'user_subscriptions/plan_stripe?access_token=' + getAccessToken();
//     return instance.post(url, {planId, price, currency, couponCode, token}).then((response) => response.data);
// }
//
// export function subscriptionPlanPaypalCreate(planId, price, currency, couponCode) {
//     const url = 'user_subscriptions/plan_paypal_create?access_token=' + getAccessToken();
//     return instance.post(url, {planId, currency, price, couponCode}).then((response) => response.data);
// }
//
// export function subscriptionPlanPaypalApprove(planId, price, currency, couponCode, paymentInfo) {
//     const url = 'user_subscriptions/plan_paypal_approve?access_token=' + getAccessToken();
//     return instance.post(url, {planId, price, currency, couponCode, paymentInfo}).then((response) => response.data);
// }

/**
 * payment functions
 */
export function paymentInfo() {
    const url = 'payments/info?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function paymentStripeSubscription(data) {
    const url = 'payments/stripe_subscription?access_token=' + getAccessToken();
    return instance.post(url, data).then((response) => response.data);
}

export function paymentSubscribedInfo() {
    const url = 'payments/user_subscribed_info?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function paymentUpdateCardSession() {
    const url = 'payments/update_card_session?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function paymentCancelSubscription() {
    const url = 'payments/cancel_subscription?access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}


/////////////////////// unused
export function paymentFree(test_set_id, price, currency, couponCode) {
    const url = 'payments/free?access_token=' + getAccessToken();
    return instance.post(url, {test_set_id, price, currency, couponCode}).then((response) => response.data);
}

export function paymentStripe(test_set_id, price, currency, couponCode, token) {
    const url = 'payments/stripe?access_token=' + getAccessToken();
    return instance.post(url, {test_set_id, price, currency, couponCode, token}).then((response) => response.data);
}

export function paymentPaypalCreate(test_set_id, price, currency, couponCode) {
    const url = 'payments/paypal_create?access_token=' + getAccessToken();
    return instance.post(url, {test_set_id, currency, price, couponCode}).then((response) => response.data);
}

export function paymentPaypalApprove(test_set_id, price, currency, couponCode, paymentInfo) {
    const url = 'payments/paypal_approve?access_token=' + getAccessToken();
    return instance.post(url, {test_set_id, price, currency, couponCode, paymentInfo}).then((response) => response.data);
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
export function couponInfo(couponCode) {
    const url = 'coupons/info?coupon_code=' + couponCode + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * enterprise functions
 */
export function enterpriseApplyTestSet(couponCode) {
    const url = 'enterprises/apply_enterprise_code?code=' + couponCode + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

/**
 * image quality functions
 */
export function setAttemptImageQuality(attempt_id, test_case_id, answer, is_post_test) {
    const url = 'answer_image_qualities/set_image_quality?access_token=' + getAccessToken();
    return instance.post(url, {attempt_id, test_case_id, answer, is_post_test}).then((response) => response.data);
}

export function getAttemptImageQuality(attempt_id, test_case_id, is_post_test) {
    const url = 'answer_image_qualities/get_image_quality?access_token=' + getAccessToken();
    return instance.post(url, {attempt_id, test_case_id, is_post_test}).then((response) => response.data);
}

export function getAttemptQuizAnswer(attempt_id, test_case_id, is_post_test) {
    const url = 'answer_image_qualities/get_quiz_answer?access_token=' + getAccessToken();
    return instance.post(url, {attempt_id, test_case_id, is_post_test}).then((response) => response.data);
}

export function submitQuizAnswer(attempt_id, test_case_id) {
    const url = 'answer_image_qualities/submit_quiz_answer?access_token=' + getAccessToken();
    return instance.post(url, {attempt_id, test_case_id}).then((response) => response.data);
}

/**
 * chest answer functions
 */
export function setAttemptChestAnswer(attempt_id, test_case_id, chest_rating, chest_answer, is_post_test) {
    const url = 'answers_chests/set_chest_answer?access_token=' + getAccessToken();
    return instance.post(url, {attempt_id, test_case_id, chest_rating, chest_answer, is_post_test}).then((response) => response.data);
}

export function getAttemptChestAnswer(attempt_id, test_case_id, is_post_test) {
    const url = 'answers_chests/get_chest_answer?access_token=' + getAccessToken();
    return instance.post(url, {attempt_id, test_case_id, is_post_test}).then((response) => response.data);
}

/**
 * book(save) test set functions
 */
export function bookTestSet(test_set_id) {
    const url = 'test_set_books/book?test_set_id=' + test_set_id + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}

export function bookTestSetCancel(test_set_id) {
    const url = 'test_set_books/book_cancel?test_set_id=' + test_set_id + '&access_token=' + getAccessToken();
    return instance.get(url).then((response) => response.data);
}