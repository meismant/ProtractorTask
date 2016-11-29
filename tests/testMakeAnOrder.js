var authorizationForm = require('./../components/authorization.form.js');
var restaurantsPage = require('./../components/restaurants.form.js');
var menuPage = require('./../components/menu.form.js');
var orderPage = require('./../components/order.form.js');
var idPage = require('./../components/id.form.js');
var jsonfile = require('jsonfile');
var testData = require("../test_data/simpleData.json");

describe('Protractor Demo App', function() {
    jsonfile.spaces = 4;
    var orderData= {} ;

    //test data
    var name, address;
    var cuisines;
    var persons;
    var paymentType, cardNumber, expireDate, cvc;
    var price = 0;

    function loadTestData() {
        name = testData.name ? testData.name : "AutoName";
        address = testData.address ? testData.address : "AutoAddress";
        cuisines = testData.cuisines ? testData.cuisines : [];
        persons = testData.persons ? testData.persons : 0;
        paymentType = testData.paymentType ? testData.paymentType : "visa";
        cardNumber = testData.cardNumber ? testData.cardNumber : "1234123412341234";
        expireDate = testData.expireDate ? testData.expireDate : "02/2017";
        cvc = testData.cvc ? testData.cvc : "290";
    }

    beforeAll(function() {
        loadTestData();
    });
    
    it('select dishes', function() {
        orderData.deliverTo = {"name ": name, "address: ": address};
        restaurantsPage.selectRestaurant(cuisines);
        menuPage.getRestaurantName().then((restaurantName) => {
            menuPage.getRestaurantDescription().then((restaurantDescription) =>{
                orderData.restaurant = {"name: ": restaurantName, "description: ": restaurantDescription};
            })
        });
        price = menuPage.selectDishes(persons);
        expect(price).toEqual( menuPage.getTotalPrice());
    });

    it('checkout', function () {
        menuPage.pressCheckout();
        expect(price).toEqual(orderPage.getTotalPrice());
    });

    it('make an order', function () {
        orderPage.makeAnOrder(paymentType, cardNumber, expireDate, cvc);
        orderData.payment = {"paymentType: ": paymentType, "cardNumber: ": cardNumber, "expireDate: ": expireDate, "cvc: ": cvc};

        orderPage.getOrderedDishes().then((dishes) => {
            orderData.items = dishes;
        });

        orderPage.pressBtnPurchase();
        idPage.getId().then((id) =>{
            orderData.orderId = {"id: ": id};
        });
    });

    afterAll(function (){
        jsonfile.writeFileSync(helpers.makefileName(), orderData);
    });

});