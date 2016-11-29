var MenuPage = function() {

    this.getMenu = function() {
        return element.all(by.repeater("menuItem in restaurant.menuItems")).map(menuRow => {
            return {
                name: menuRow.evaluate("menuItem.name"),
                price: menuRow.evaluate("menuItem.price"),
                addToCard: () => menuRow.element(by.css(" a")).click()
                    .then(() => logger.debug("Add item to card"))
                    .catch(err => logger.error("Unable to add item to card"))
            };
        })
    };

    this.addToOrder = function(orderList) {
        if(!Array.isArray(orderList)) throw new Error("Invalid orderList param");

        return this.getMenu()
            .then((foundMenu) => {
                var addToOrderPromises = [];
                orderList.forEach(customerOrder => {
                    foundMenu.forEach(menuItem => {
                        if (menuItem.name === customerOrder.name) {
                            addToOrderPromises.push(menuItem.addToCard());
                        }
                    })
                });
                return protractor.promise.all(addToOrderPromises);
            })
    };

    this.currentOrder = new OrderCard();

    this.btnCheckout = element(by.className('btn'));

    this.selectDishes = function (persons) {
        return getListOfDishes()
            .then((list) =>{
                sortListOfDishes(list);
                return chooseCheapestDishes(list);});

        function getListOfDishes() {
            return element.all(by.repeater("menuItem in restaurant.menuItems")).map(function (currentRow, index) {
                return {
                    index: index,
                    name: currentRow.all(by.css("span.ng-binding")).first().getText(),
                    price: currentRow.all(by.css("span.ng-binding")).last().getText(),
                    addToOrder: function () {
                        return currentRow.element(by.css(" a")).click()
                            .then(()=> {logger.debug("MenuPage: Select item from menu");})
                            .catch((err) => {throw new Error("MenuPage: Error while selecting item from menu: " + err.message);});
                    }
                }
            });
        }
        function sortListOfDishes(list) {
            return list.sort(function (a, b) {
                var keyA = Number(a.price);
                var keyB = Number(b.price);
                return (keyA < keyB) ? -1 : ((keyA > keyB) ? 1 : 0);
            });
        }
        function chooseCheapestDishes(sortedList) {
            if ((persons < 1) || (persons > 4)) {
                persons = Math.floor((Math.random() * 4) + 1);
            }
            logger.debug("There is/are " + persons + " person(s)");

            var price = 0;
            for (var i = 0; i < persons; i++) {
                price = Number(sortedList[i].price)+Number(price);
                sortedList[i].addToOrder();
            }
            return price;
        }
    };

    this.getTotalPrice = function () {
        return element(by.css("form.ng-pristine.ng-valid")).element(by.css("b.ng-binding")).getText()
            .then( (text) => {return Number(text.substring(8,text.length));});
    };

    this.pressCheckout = function () {
        return this.btnCheckout.click()
            .then(() => {return logger.debug("MenuPage: Press checkout button");})
            .catch( (err) =>{throw new Error("MenuPage: Error while pressing checkout button: " + err.message);})
    };

    this.getRestaurantName = function () {
        return element(by.css("h3.ng-binding")).getText()
            .then((text) =>{return text;});
    }

    this.getRestaurantDescription = function () {
        return element(by.className("span4")).getText()
            .then((text) => {return text;});
    }
};

function OrderCard() {

    this.getCurrentItems = function() {
        return element.all(by.repeater("item in cart.items")).map(itemRow => {
            return {
                name: itemRow.evaluate("item.name"),
                quantity: itemRow.evaluate("item.qty")
            }
        })
    };

    this.getCurrentTotal = function() {
        return element(by.className("fm-cart")).evaluate("cart.total()")
            .then((foundTotal) => {
                logger.debug("Get current total: " + foundTotal);
                return foundTotal;
            })
            .catch(error => logger.error("Unable to get current total: " + error));
    }
}

module.exports = new MenuPage();