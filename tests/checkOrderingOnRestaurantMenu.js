"use strict";
var restaurantForm = require("./../components/restaurants.form.js");
var menuForm = require("./../components/menu.form.js");

xdescribe("Check ordering from restaurant menu.", () => {

    var menuOrder = menuForm.currentOrder;
    var availableInMenuItems = [];
    var restaurantName = "Angular Pizza";

    beforeAll((done) => {
        helpers.openHomePage()
            .then(() => restaurantForm.openRestaurant(restaurantName))
            .then(() => menuForm.getMenu())
            .then((shownMenu) => {
                shownMenu.forEach(item => {
                    availableInMenuItems.push({name: item.name, price: item.price});
                    item.addToCard();
                })
            })
            .then(() => done())
            .catch(err => done.fail(err));
    });

    it("menu items should be added to order", (done) => {
        menuOrder.getCurrentItems()
            .then((orderedItems) => {
                availableInMenuItems.forEach(menuItem => {
                    expect(Array.from(orderedItems, item => item.name)).toContain(menuItem.name);
                    expect(Array.from(orderedItems, item => item.quantity)).toContain(1); // each item was ordered once
                })
            })
            .then(() => done());
    });

    it("total price should be calculated correctly", () => {
        var expectedTotalPrice = 0;
        availableInMenuItems.forEach(menuItem => {
            expectedTotalPrice += menuItem.price;
        });

        menuOrder.getCurrentTotal().then((currentTotal) => {
            expect(currentTotal.toFixed(2)).toEqual(expectedTotalPrice.toFixed(2));
        });
    })
});
