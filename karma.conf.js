var projectConfig = require('./project.conf.js');

module.exports = function (config) {

    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: projectConfig.javaScriptFiles.external
            .concat([
                projectConfig.depDir + '/angular-mocks/angular-mocks.js',
                'temp/moduleDefinition.js',
                'node_modules/fragrance/lib/fragrance.js',
                'node_modules/side-nav/dist/init-side-nav.js',
                'node_modules/wwt-env/dist/wwt-env.min.js',
                projectConfig.html2js.outputFile
            ])
            .concat(projectConfig.javaScriptFiles.internal),

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        colors: true,

        exclude: [

        ],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari
        // - PhantomJS
        browsers: ['Chrome'],

        preprocessors: {
            'src/**/!(*Spec).js': ['babel', 'coverage']
        },

        babelPreprocessor: {
            options: {
                presets: ['es2015']
            }
        },

        // possible values: 'dots', 'progress', 'junit'
        reporters: ['dots', 'junit', 'coverage'],

        junitReporter: {
            outputDir: 'out/',
            outputFile: 'unit-test-results.xml'
        },

        coverageReporter: {
            type: 'cobertura',
            dir: 'out/',
            file: 'cobertura.xml'
        },

        // report which specs are slower than 500ms
        reportSlowerThan: 500,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        plugins: [
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-babel-preprocessor'
        ]
    });
};
