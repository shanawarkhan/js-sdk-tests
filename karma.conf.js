function hostedTestFiles (list) {
  ret = {};
  list.forEach(function(name, i) {
    ret[name] = process.env.TEST_DATA_SRV_URL+name;
  });
  return ret;
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'spec/*spec.js',
      process.env.AFFDEX_JS_SDK_URL+'/affdex.js',
      {pattern: process.env.TEST_DATA_SRV_URL+'/*', included: false, watched: false, served: true},
    ],

    proxies: hostedTestFiles([
      "/videos/web_face_video.mp4",
      "/videos/black.mp4",
      "/photos/merkel.jpg",
      "/photos/bicentennial.jpg",
      "/photos/matt-czuchry.jpg",
      "/photos/steve_disgust.bmp",
      "/photos/steve_neutral.bmp",
      "/photos/steve_surprised.bmp"
    ]),

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.js': ['env']
    },

    envPreprocessor: [
      'AFFDEX_JS_SDK_URL',
      'TEST_DATA_SRV_URL'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    browserNoActivityTimeout: 100000,

    customLaunchers: {
      Chrome_with_fake_media: {
        base: 'Chrome',
        flags: ['--use-fake-ui-for-media-stream']
      },
      Chrome_Canary_with_fake_media: {
        base: 'Chrome Canary',
        flags: ['--use-fake-ui-for-media-stream']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome_with_fake_media', 'Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
