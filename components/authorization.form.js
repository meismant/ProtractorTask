var AuthorizationPage = function() {

    this.inputName = element(by.model('customerName'));
    this.inputAddress = element(by.model('customerAddress'));
    this.btnFindRestaurants = element(by.css('[ng-click="findRestaurants(customerName, customerAddress)"]'));

    this.navigate = function () {
        return browser.get('/');
    };

    this.authorizate = function(name, address) {
         return this.fillInputName(name)
            .then(() => this.fillInputAddress(address))
            .then(() => this.pressFindRestaurantsButton())
    };

    this.fillInputName = function (name) {
        return this.inputName.sendKeys(name)
            .then(() => {logger.debug("Authorization: Typing text in 'Name': " + name);})
            .catch((err) => {throw new Error("Authorization: Error while typing in 'Name': " + err.message);})
    };

    this.fillInputAddress = function (address) {
        return this.inputAddress.sendKeys(address)
            .then(() => {logger.debug("Authorization: Typing text in 'Address': " + address);})
            .catch((err) => {throw new Error("Authorization: Error while typing in 'Address': " + err.message);})
    };

    this.pressFindRestaurantsButton = function () {
        return this.btnFindRestaurants.click()
            .then(()=>{logger.debug("Authorization: Click 'Find Restaurants' button");})
            .catch((err) => {throw new Error("Authorization: Error while clicking 'Find Restaurants' button" + err.message);})
    };
};

module.exports = new AuthorizationPage();

