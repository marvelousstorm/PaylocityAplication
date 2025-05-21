module.exports = defineConfig({
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 15000,
  requestTimeout: 30000,
  videoCompression: false,
  grepFilterSpecs: true,
  retries: 1,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      e2e: true,
      platform: 'production',
      baseURL: 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/',
      username: 'TestUser747',
      password: 'gQ;)DE3[9qFJ',
      authorizationCode: "Basic VGVzdFVzZXI3NDc6Z1E7KURFM1s5cUZK"
    },
  },
});