"use strict";
var testData = require("../test_data/simpleData.json");

function Helpers() {

    this.openHomePage = function() {
        var linkHome = element(by.className("brand"));

        function goHome() {
            return linkHome.click().then(() => logger.debug("Open home page")).thenCatch(err => logger.error("Error on navigating to home page"));
        }

        return browser.getCurrentUrl().then((currentUrl) => {
            logger.debug("Current page: " + currentUrl);
            return currentUrl === browser.baseUrl ? logger.debug("Home page is already opened") : goHome();
        })
    }
    this.makefileName = function () {
        var d = new Date();
        var file = "./res/" + (d.getFullYear())+ (d.getMonth() + 1) + (d.getDate()) + ".json";
        return file.toString();
    }
}

module.exports = new Helpers();

