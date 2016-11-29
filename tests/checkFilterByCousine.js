"use strict";
var data = require("./../test_data/simpleData.json");
var filters = require("./../components/filters");
var restaurantTable = require("./../components/restaurants.form.js");

xdescribe("Check filtering by cuisine.", () => {

    beforeAll((done) => {
        helpers.openHomePage().then(() => done());
    });

    it("shown restaurants should correspond to selected filter", (done) => {
        filters.filterByCuisine(data.cuisines)
            .then(() => restaurantTable.getShownRestaurants())
            .then((shownRestaurants) => {
                data.cuisines.forEach((expectedCuisine) => {
                    expect(Array.from(shownRestaurants, foundRestaurant => foundRestaurant.cuisine)).toContain(expectedCuisine.toLowerCase());
                })
            })
            .then(() => done());
    })
});