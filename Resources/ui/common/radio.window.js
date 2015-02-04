var TiCircularSlider = require('de.marcelpociot.circularslider');

module.exports = function() {
    var window = Ti.UI.createWindow({
        backgroundColor : 'white'
    });
    var stations = require('model/stations');
    var phi = 0;
    var container = Ti.UI.createView({
        bottom : '20%'
    });
    window.add(container);
    var sliderView = TiCircularSlider.createView({
        height : 300,
        width : 300,
        lineWidth : 1,
        filledColor : 'transparent',
        unfilledColor : 'grey'
    });
    sliderView.addEventListener('change', function(e) {
        Ti.API.info("Value is: ", e.value);
    });

    
    var stationviews = [];
    var anchorPoint = {
        x : 0.5,
        y : 3
    };
    for (var i = 0; i < stations.length; i++) {
        stationviews[i] = Ti.UI.createImageView({
            image : '/images/' + stations[i].logo.toLowerCase() + '.png',
            width : 200,
            height : 200,

            transform : Ti.UI.create2DMatrix({
                rotate : 360 / stations.length * i,
                anchorPoint : anchorPoint
            })
        });
        container.add(stationviews[i]);
    }
    window.addEventListener('open', function() {
    });

    window.addEventListener('swipe', function(_e) {
        if (_e.direction == 'left') {
            phi -= 360 / stations.length;
        }
        if (_e.direction == 'right') {
            phi += 360 / stations.length;
        }
        //    phi = 360 - _e.currentPage * 360 / stations.length;
        stationviews.forEach(function(view, ndx) {
            view.animate({
                duration : 100,
                transform : Ti.UI.create2DMatrix({
                    rotate : phi + 360 / stations.length * ndx,
                    anchorPoint : anchorPoint
                })
            });

        });

    });
    var slider = Ti.UI.createSlider({
        bottom : 0,
        height : 50,
        min : 0,
        max : 360
    });
    var control = Ti.UI.createButton({
        bottom : 20,
        width : 100,
        height : 100,
        backgroundImage : '/images/play.png'
    });
    window.add(control);
    return window;
};
