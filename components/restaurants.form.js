"use strict";

var RestaurantsPage;
RestaurantsPage = function () {
    this.labelSortByRating = element(by.partialLinkText('Rating'));
    this.imgSelectedByRating = element(by.repeater('restaurant in restaurants')).element(by.model("$parent.restaurant.rating")).all(by.css('li.ng-scope.ng-binding.fm-selected'));
    this.labelSortByPrice = element(by.partialLinkText('Price'));
    this.imgSelectedByPrice = element(by.repeater('restaurant in restaurants')).element(by.model("$parent.restaurant.price")).all(by.css('li.ng-scope.ng-binding.fm-selected'));
    this.firstRestaurant = element(by.repeater('restaurant in restaurants')).element(by.tagName('a'));

    this.getShownRestaurants = function () {
        return element.all(by.repeater("restaurant in restaurants")).map((tableRow, indexRow) => {
            return {
                index: indexRow,
                name: tableRow.evaluate("restaurant.name"),
                cuisine: tableRow.evaluate("restaurant.cuisine"),
                price: tableRow.evaluate("restaurant.price"),
                rating: tableRow.evaluate("restaurant.rating")
            }
        })
    };

    this.openRestaurant = function (name) {
        return element.all(by.repeater("restaurant in restaurants")).map((tableRow) => {
            return tableRow.evaluate("restaurant.name").then((foundName) => {
                if (foundName === name) {
                    return tableRow.element(by.css(" a")).click()
                        .then(() => logger.debug("Open restaurant: " + name))
                        .catch(err => logger.error("Error when click to open restaurant: " + name));
                }
            })
        })
    };

    /**
     * Sort restaurants table
     * @param option - {name: {column name}, asc: boolean}
     * @returns {*}
     */
    this.sortBy = function (option) {
        if (!option) throw new Error("Missing sort options");

        function isValidOption(opt) {
            return opt.match(/name|price|rating/)
        }

        var targetOption = option.name ? option.name.toLowerCase() : option;
        var targetOrder = option.asc ? option.asc : true; // by default sort by Asc

        if (!isValidOption(targetOption)) throw new Error("Unknown sort option: " + targetOption);

        function getCurrentSort() {
            return element(by.className("table")).evaluate("filter");
        }

        return getCurrentSort()
            .then((currentSortOptions) => {
                if (currentSortOptions.sortBy === targetOption && currentSortOptions.sortAsc === targetOrder) {
                    logger.debug("Is already sorted by: " + targetOption + ", Asc: " + targetOrder);
                } else {
                    element(by.binding(targetOption)).click()
                        .then(() => logger.debug("Sort by: " + targetOption + ", Asc: " + targetOrder))
                        .catch(err => logger.error("Error when sorting by " + option));
                }
            });
    };

    this.selectRestaurant = function (cuisines) {
        this.selectCuisine(cuisines);
        this.filterByRating();
        this.filterByPrice();
        this.selectFirstRestaurant();
    }

    this.selectCuisine = function (cuisines) {
        if (cuisines != 0) {
            return selectPredefinedCuisines(cuisines);
        } else {
            return selectRandomCuisine();
        }

        function selectPredefinedCuisines(cuisines) {
            cuisines.forEach((cuisine) => {
                return element(by.xpath('//input[@value="' + cuisine + '"]')).click()
                    .then(() => {
                        return element(by.xpath('//input[@value="' + cuisine + '"]')).getAttribute("value")
                            .then((text) => {
                                logger.debug("RestaurantsPage: Select predefined cuisine: " + text);
                                return text;
                            })
                    })
                    .catch((err) => {
                        throw new Error("RestaurantsPage: Error while selecting predefined cuisine: " + err.message);
                    })
            });
        }

        function selectRandomCuisine() {
            var randomValue;
            return element.all(by.repeater('CUISINE_OPTIONS')).count()
                .then((count) => {
                    randomValue = Math.floor((Math.random() * count));
                    return element.all(by.repeater('CUISINE_OPTIONS')).get(randomValue).click()
                        .then(() => {
                            return element.all(by.repeater('CUISINE_OPTIONS')).get(randomValue).getText()
                                .then((text) => {
                                    logger.debug("RestaurantsPage: Select random cuisine: " + text);
                                    return text;
                                })
                        })
                })
                .catch((err) => {
                    throw new Error("RestaurantsPage: Error while selecting random cuisine: " + err.message);
                })
        }
    }

    this.filterByRating = function () {
        this.labelSortByRating.click().click()
            .then(() => {
                logger.debug("RestaurantsPage: Sort restaurants by rating");
            })
            .catch((err) => {
                throw new Error("RestaurantsPage: Error while sorting restaurants by rating: " + err.message);
            });

        this.imgSelectedByRating.count().then(function (count) {
            element(by.model('$parent.filter.rating')).all(by.tagName('li')).get(count - 1).click()
                .then(() => {
                    logger.debug("RestaurantsPage: Filter restaurants by rating");
                })
                .catch((err) => {
                    throw new Error("RestaurantsPage: Error while filtering restaurants by rating: " + err.message);
                })
        });
    };

    this.filterByPrice = function () {
        this.labelSortByPrice.click()
            .then(() => {
                logger.debug("RestaurantsPage: Sort restaurants by price");
            })
            .catch((err) => {
                throw new Error("RestaurantsPage: Error while sorting restaurants by price: " + err.message);
            });

        this.imgSelectedByPrice.count().then(function (count) {
            element(by.model('$parent.filter.price')).all(by.tagName('li')).get(count - 1).click()
                .then(() => {
                    logger.debug("RestaurantsPage: Filter restaurants by price");
                })
                .catch((err) => {
                    throw new Error("RestaurantsPage: Error while filtering restaurants by price: " + err.message);
                })
        })
    }

    this.selectFirstRestaurant = function () {
        this.firstRestaurant.getText()
            .then((text) => {
                logger.debug("RestaurantsPage: Select restaurant: " + text);
                return text;
            })
            .catch((err) => {
                throw new Error("RestaurantsPage: Error while selecting restaurant: " + err.message);
            })
        return this.firstRestaurant.click();
    }
};

module.exports = new RestaurantsPage();


