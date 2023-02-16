module.exports = function (config) {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: "src/**/*.ts" }
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        noImplicitAny: false,
        noImplicitReturns: false,
        noImplicitThis: false,
        allowSyntheticDefaultImports: false
      }
    },
    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
}
