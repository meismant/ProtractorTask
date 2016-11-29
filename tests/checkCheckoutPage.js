"use strict";
var restaurantForm = require("./../components/restaurants.form.js");
var menuForm = require("./../components/menu.form.js");
var checkoutForm = require("./../components/order.form.js");

xdescribe("Check checkout table.", () => {

    var customerOrder = {
        cuisine: "Pizza",
        restaurant: "Angular Pizza",
        order: [{
            name: "Cesar salad",
            quantity: 1
        }, {
            name: "Pizza of the day (slice)",
            quantity: 1
        }, {
            name: "Thin crust pepperoni",
            quantity: 1
        }]
    };

    beforeAll((done) => {
        helpers.openHomePage()
            .then(() => restaurantForm.openRestaurant(customerOrder.restaurant))
            .then(() => menuForm.addToOrder(customerOrder.order))
            .then(() => menuForm.pressCheckout())
            .then(() => done())
            .catch(err => done.fail(err));
    });

    it("ordered items should be shown", (done) => {
        checkoutForm.getOrderedDishes()
            .then((foundItems) => {
                expect(foundItems.length).toEqual(customerOrder.order.length);
                foundItems.forEach((foundItem, index) => {
                    expect(foundItem.name).toEqual(customerOrder.order[index].name);
                    expect(foundItem.quantity).toEqual(customerOrder.order[index].quantity);
                })
            })
            .then(() => done());
    });
});