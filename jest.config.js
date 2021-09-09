module.exports = {
  reporters: ["default", "jest-allure"],
  setupFilesAfterEnv: ['jest-allure/dist/setup'],
  testRunner: 'jest-jasmine2'
};
