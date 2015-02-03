var TiCircularSlider = require('de.marcelpociot.circularslider');

module.exports = function() {
    var window = Ti.UI.createWindow({
        backgroundColor : 'white'
    });
    var phi = 0;
    var container = Ti.UI.createView();
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

    var stations = ['dlr', 'sr', 'wdr', 'ndr', 'mdr', 'br', 'dlf', 'rbb', 'rb'];
    var stationviews = [];
    var anchorPoint = {
        x : 0.5,
        y : 2
    };
    for (var i = 0; i < stations.length; i++) {
        stationviews[i] = Ti.UI.createImageView({
            image : '/images/' + stations[i] + '.png',
            width : 200,
            height : 200,
            borderWith : 1,
            borderColor : 'silver',
            transform : Ti.UI.create2DMatrix({
                rotate : 360 / stations.length * i,
                anchorPoint : anchorPoint
            })
        });
        container.add(stationviews[i]);
    }
    window.addEventListener('open', function() {
        //window.add(sliderView);
    });
    var dummyviews = [];
    for (var i = 0; i < stations.length * 10; i++) {
        dummyviews.push(Ti.UI.createView({
            width : '50%',
            borderColor : 'red',
            borderWidth : 1
        }));
    }
    var dummyscroller = Ti.UI.createScrollableView({
        views : dummyviews,
        currenPage : Math.round(stations.length / 2 * 10)
    });

    //window.add(dummyscroller);
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

    return window;
};
