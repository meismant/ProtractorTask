var OrderPage = function() {
    this.paymentType = element(by.model("cart.payment.type"));
    this.inputCardNumber = element(by.model("cart.payment.number"));
    this.inputExpireDate = element(by.model("cart.payment.expire"));
    this.inputCVC = element(by.model("cart.payment.cvc"));
    this.btnPurchase = element(by.css('[ng-click="purchase()"]'));

    this.makeAnOrder = function (paymentType,cardNumber, date, cvc) {
        this.choosePaymentType(paymentType)
        this.fillInputCardNumer(cardNumber);
        this.fillInputExpireDate(date);
        this.fillInputCVC(cvc);
    }

    this.choosePaymentType = function (paymentType) {
        return this.paymentType.element(by.css('[value="'+paymentType+'"]')).click()
            .then(() => { logger.debug("OrderPage: Select payment type: " + paymentType);})
            .catch((err) => {throw new Error("OrderPage: Error while selecting payment option: " + err.message);})
    }

    this.fillInputCardNumer = function (cardNumber) {
        this.inputCardNumber.sendKeys(cardNumber)
            .then(() => {logger.debug("OrderPage: Typing text in 'Card Number': " + cardNumber);})
            .catch((err) => {throw new Error("OrderPage: Error while typing text in 'Card Number': " + err.message);})
    }

    this.fillInputExpireDate = function (date) {
        return this.inputExpireDate.sendKeys(date)
            .then(() => {logger.debug("OrderPage: Typing text in 'Expire Date': " + date);})
            .catch((err) => {throw new Error("OrderPage: Error while typing text in 'Expire Date': " + err.message);})
    }

    this.fillInputCVC = function (cvc) {
        return this.inputCVC.sendKeys(cvc)
            .then(() => {logger.debug("OrderPage: Typing text in 'CVC': " + cvc);})
            .catch((err) => {throw new Error("OrderPage: Error while typing text in 'CVC': " + err.message);})
    }

    this.pressBtnPurchase = function () {
        return this.btnPurchase.click()
            .then(() => {logger.debug("OrderPage: Click 'Purchase' button");})
            .catch((err) => {throw new Error("OrderPage: Error while cliking 'Purchase' button" + err.message);})
    }

    this.getOrderedDishes = function(){
        return element.all(by.repeater("item in cart.items")).map(function (currentRow, index) {
            return {
                quantity: currentRow.evaluate("item.qty"),
                name: currentRow.evaluate("item.name"),
                price: currentRow.evaluate("item.price"),
                subTotal: currentRow.evaluate("item.price * item.qty")
            }
        })
    };

    this.getTotalPrice = function () {
        return element(by.className("table")).evaluate("cart.total()");
    };
};

module.exports = new OrderPage();
