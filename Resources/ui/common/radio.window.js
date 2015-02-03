var TiCircularSlider = require('de.marcelpociot.circularslider');

module.exports = function(item) {
    var win = Ti.UI.createWindow({
        title : item.title,
        backgroundColor : 'white',
        fullscreen : true
    });
    var sliderView = TiCircularSlider.createView({
        height : 250,
        width : 250,
        lineWidth : 5,
        filledColor : 'blue',
        unfilledColor : 'grey'
    });
    sliderView.addEventListener('change', function(e) {
        Ti.API.info("Value is: ", e.value);
    });
    win.add(sliderView);
    return win;
};
