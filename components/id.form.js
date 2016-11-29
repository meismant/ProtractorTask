var IdPage = function() {

    this.id = element(by.css("p.ng-binding"));

    this.getId = function () {
        return this.id.getText()
            .then((text) => {
                var id = text.replace(/[^0-9]/g,'');
                logger.debug("Order ID is "+ id);
                return id;})
            .catch((err) => {throw new Error("IdPage: Error while getting order id: " + err.message);})
    }
};

module.exports = new IdPage();

