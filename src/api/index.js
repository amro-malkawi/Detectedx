import axios from 'axios';

export default axios.create({
   baseURL: 'http://reactify.theironnetwork.org/data/',
   timeout: 2000
});

const instance = axios.create({
   // baseURL: 'http://demo.detectedx.com:3000/api/',
   baseURL: 'http://127.0.0.1:3000/api/',
   timeout: 20000
});

export function getAccessToken() {
   return localStorage.getItem("access_token");
}

export function login(email, password) {
   const url = '/users/login';
   const req = {
      email,
      password
   };
   return instance.post(url, req).then((response) => response.data);
}

export function singUp(email, password) {
   const url = '/users';
   const req = {
      email,
      password
   };
   return instance.post(url, req).then((response) => response.data);
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

export function userUpdate(id, data) {
   const url = '/users/' + id + '?access_token=' + getAccessToken();
   delete data["created_at"];
   delete data["updated_at"];
   return instance.patch(url, data).then((response) => response.data);
}

export function userDelete(id) {
   const url = '/users/' + id + '?access_token=' + getAccessToken();
   return instance.delete(url).then((response) => response.data);
}

/**
 * test sets operation
 */

export function testSetsList(page) {
   let url = '/test_sets?access_token=' + getAccessToken();
   if(page !== undefined) {
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

/**
 * modalities operation
 */

export function modalitiesList(page) {
   let url = '/modalities?access_token=' + getAccessToken();
   if(page !== undefined) {
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
   if(page !== undefined) {
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
 * test_cases operation
 */

export function testCasesList(page) {
   let url = '/test_cases?access_token=' + getAccessToken();
   if(page !== undefined) {
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

export function testCasesInfo(id) {
   const url = '/test_cases/' + id + '?access_token=' + getAccessToken();
   return instance.get(url).then((response) => response.data);
}

export function testCasesImagesList(id) {
   const url = '/test_cases/' + id + '/images?access_token=' + getAccessToken();
   return instance.get(url).then((response) => response.data);
}

/**
 * test-set-assignments operation
 */

export function testSetAssignmentsList(page) {
   let url = '/test_set_assignments?access_token=' + getAccessToken();
   if(page !== undefined) {
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
   if(page !== undefined) {
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
   if(page !== undefined) {
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
   if(page !== undefined) {
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
   if(page !== undefined) {
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

export function dicomImagesUpload(data) {
   console.warn(JSON.stringify(data));
   let url = '/images/upload?access_token=' + getAccessToken() + '&test_case_id=' + data.test_case_id + '&position=' + data.position;
   if(data.id !== undefined) {
      url += '&id=' + data.id;
   }
   // const url = '/containers/dicom/upload?access_token=' + getAccessToken();
   const formData = new FormData();
   formData.append('file', data.dicom_file);
   const config = {
      headers: {
         'content-type': 'multipart/form-data'
      }
   };
   return instance.post(url, formData, config).then((response) => response.data);
}

export function imagesUrlTemplate(id) {
   const url = '/images/urlTemplate?id=' + id + '&access_token=' + getAccessToken();
   return instance.get(url).then((response) => response.data);
}

/**
 * truths operation
 */

export function truthsList(page) {
   let url = '/truths?access_token=' + getAccessToken();
   if(page !== undefined) {
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
   if(page !== undefined) {
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
   if(page !== undefined) {
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
   if(page !== undefined) {
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

export function attemptsRatingScale(id) {
   const url = '/attempts/' + id + '/rating_scales?access_token=' + getAccessToken();
   return instance.get(url).then((response) => response.data);
}