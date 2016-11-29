exports.config = {
    allScriptsTimeout: 1000000,

    framework: 'jasmine2',

    capabilities: {
        browserName: 'chrome',
        specs: [
            'tests/*.js'
        ],
        'chromeOptions': {
            'args': [
                'incognito',
                'disable-extensions',
                'start-maximized'
            ]
        },
        shardTestFiles: true,
        maxInstances: 1
    },

    baseUrl: 'https://lit-basin-41473.herokuapp.com/#/',

    onPrepare: function() {
        var authorizationForm = require('./components/authorization.form.js');
        var helperFunctions = require("./utils/helpers");
        var testData = require("./test_data/simpleData.json");

        global.logger = require('log4js').getLogger();
        global.helpers = helperFunctions;

        beforeAll((done) => {
            browser.ignoreSynchronization = true;

            authorizationForm.navigate()
                .then(() => browser.ignoreSynchronization = false)
                .then(() => authorizationForm.authorizate(testData.name, testData.address))
                .then(() => done())
                .catch(err => done.fail(err));
        });
    },

    jasmineNodeOpts: {
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 1000000
    }
};
