"use strict";

function Filters() {

    function getAllCuisines() {
        return element.all(by.repeater("(name, title) in CUISINE_OPTIONS")).map((cuisineRow, indexRow) => {
            return {
                index: indexRow,
                title: cuisineRow.getText(),
                select: () => cuisineRow.click().then(() => logger.debug("Select cuisine")).catch(err => logger.error("Can't select cuisine: " + err))
            };
        })
    }


    this.filterByCuisine = function(cuisines) {
        return getAllCuisines()
            .then((cuisinesMap) => {
                var selectCuisinePromises = [];
                cuisines.forEach(cuisine => {
                    cuisinesMap.forEach(cuisineBox => {
                        if(cuisineBox.title === cuisine) {
                            selectCuisinePromises.push(cuisineBox.select());
                        }
                    })
                });
                return protractor.promise.all(selectCuisinePromises);
            });
    }
}

module.exports = new Filters();