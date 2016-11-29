"use strict";
var _ = require("lodash");
var restaurantTable = require("./../components/restaurants.form.js");

xdescribe("Check restaurants sorting", () => {

    var initialShownRestaurants;

    beforeAll((done) => {
        helpers.openHomePage()
            .then(() => restaurantTable.getShownRestaurants())
            .then((foundRestaurants) => initialShownRestaurants = foundRestaurants)
            .then(() => done())
            .catch(err => done.fail(err));
    });


    it("sort by price column", (done) => {
        var restaurantsByPrice = _.sortBy(initialShownRestaurants, "price");

        restaurantTable.sortBy({name: "Price", acs: true})
            .then(() => restaurantTable.getShownRestaurants())
            .then((foundSortedRests) => {
                expect(foundSortedRests.length).toEqual(restaurantsByPrice.length);
                for (var i = 0; i < foundSortedRests.length; i++) {
                    expect(foundSortedRests[i].price).toEqual(restaurantsByPrice[i].price);
                }
            })
            .then(() => done());
    });

    it("sort by rating column", (done) => {
        var restaurantsByRating = _.sortBy(initialShownRestaurants, "rating");

        restaurantTable.sortBy({name: "Rating", acs: true})
            .then(() => restaurantTable.getShownRestaurants())
            .then((foundSortedRests) => {
                expect(foundSortedRests.length).toEqual(restaurantsByRating.length);
                foundSortedRests.forEach((foundItem, index) => {
                    expect(foundItem.rating).toEqual(restaurantsByRating[index].rating);
                });
            })
            .then(() => done());
    });
});