var TiCircularSlider = require('de.marcelpociot.circularslider');

module.exports = function() {
    var window = Ti.UI.createWindow({
        backgroundColor : 'white'
    });
    var sliderView = TiCircularSlider.createView({
        height : 250,
        width : 250,
        top : 250,
        lineWidth : 50,
        filledColor : 'red',
        unfilledColor : 'grey'
    });
    sliderView.addEventListener('change', function(e) {
        Ti.API.info("Value is: ", e.value);
    });
    window.add(sliderView);
    var stations = ['dlr', 'sr', 'wdr', 'ndr', 'mdr', 'br', 'dlf', 'rbb', 'rb'];
    var stationviews = [];
    for (var i = 0; i < stations.length; i++) {
        stationviews[i] = Ti.UI.createImageView({
            image : '/images/' + stations[i] + '.png',
            width : 200,
            bottom : 100,
            height : 200,
            transform : Ti.UI.create2DMatrix({
                rotate : 360 / stations.length * i,
                anchorPoint : {
                    x : 0.9,
                    y : 2
                }
            })
        });
        window.add(stationviews[i]);
    }
    return window;
};
