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

  return config
}
