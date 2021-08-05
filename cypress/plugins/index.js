const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
dotenv.config();

/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  
  config.defaultCommandTimeout = 138000 // defaultCommandTimeout = 4000
  config.requestTimeout = 60000 // default requestTimeout = 5000
  config.responseTimeout = 60000 // default responseTimeout = 30000
  // api url
  config.env.apiUrl = process.env.API_URL

  // sign in
  config.env.test_username = process.env.TEST_USER_NAME
  config.env.test_password = process.env.TEST_PASSWORD

  // sign up
  config.env.test_signup_first_name = process.env.TEST_SIGN_UP_FIRST_NAME
  config.env.test_signup_last_name = process.env.TEST_SIGN_UP_LAST_NAME
  config.env.test_signup_email = process.env.TEST_SIGN_UP_EMAIL
  config.env.test_signup_password = process.env.TEST_SIGN_UP_PASSWORD
  config.env.test_signup_confirm_password = process.env.TEST_SIGN_UP_CONFIM_PASSWORD
  config.env.test_signup_country = process.env.TEST_SIGN_UP_COUNTRY
  config.env.test_signup_state = process.env.TEST_SIGN_UP_STATE
  config.env.test_signup_postcode = process.env.TEST_SIGN_UP_POSTCODE
  config.env.test_signup_job_title = process.env.TEST_SIGN_UP_JOB_TITLE
  config.env.test_signup_job_title_value = process.env.TEST_SIGN_UP_JOB_TITLE_VALUE
  config.env.test_signup_insitution = process.env.TEST_SIGN_UP_INSITUTION
  config.env.test_signup_checkbox_allow_to_contact = process.env.TEST_SIGN_UP_CHECKBOX_ALLOW_TO_CONTACT
  config.env.test_signup_checkbox_read_and_agree_term_of_conditions = process.env.TEST_SIGN_UP_CHECKBOX_READ_AND_AGREE_TERM_OF_CONDITIONS
  
  // test set coupon
  config.env.test_set_coupon_invalid_code = process.env.TEST_SET_COUPON_INVALID_CODE
  config.env.test_set_coupon_valid_code = process.env.TEST_SET_COUPON_VALID_CODE

  // ======================================== start [user page] ========================================
  // personal information
  config.env.test_user_page_first_name = process.env.TEST_USER_PAGE_FIRST_NAME
  config.env.test_user_page_last_name = process.env.TEST_USER_PAGE_LAST_NAME
  
  // address information
  config.env.test_user_page_address_country = process.env.TEST_USER_PAGE_ADDRESS_COUNTRY
  config.env.test_user_page_address_line_1 = process.env.TEST_USER_PAGE_ADDRESS_LINE_1
  config.env.test_user_page_address_line_2 = process.env.TEST_USER_PAGE_ADDRESS_LINE_2
  config.env.test_user_page_address_suburb = process.env.TEST_USER_PAGE_ADDRESS_SUBURB
  config.env.test_user_page_address_state = process.env.TEST_USER_PAGE_ADDRESS_STATE
  config.env.test_user_page_address_postcode = process.env.TEST_USER_PAGE_ADDRESS_POSTCODE
  
  // password information
  config.env.test_user_page_current_password = process.env.TEST_USER_PAGE_CURRENT_PASSWORD
  config.env.test_user_page_new_password = process.env.TEST_USER_PAGE_NEW_PASSWORD
  config.env.test_user_page_confirm_new_password = process.env.TEST_USER_PAGE_CONFIRM_NEW_PASSWORD
  
  // additional information
  config.env.test_user_page_additional_places_of_work = process.env.TEST_USER_PAGE_ADDITIONAL_PLACES_OF_WORK
  config.env.test_user_page_additional_position = process.env.TEST_USER_PAGE_ADDITIONAL_POSITION
  config.env.test_user_page_additional_interests = process.env.TEST_USER_PAGE_ADDITIONAL_INTERESTS
  config.env.test_user_page_additional_referred_by = process.env.TEST_USER_PAGE_ADDITIONAL_REFERRED_BY
  config.env.test_user_page_additional_extra_info = process.env.TEST_USER_PAGE_ADDITIONAL_EXTRA_INFO
  // ======================================== end [user page] ========================================
  
  return config
}
