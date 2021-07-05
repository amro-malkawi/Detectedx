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
  config.env.test_username = process.env.TEST_USER_NAME
  config.env.test_password = process.env.TEST_PASSWORD
  config.env.apiUrl = process.env.API_URL
  return config
}
