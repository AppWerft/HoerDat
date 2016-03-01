const BIG = 32000,
    SEGMENTS = 360 / 12,
    GEAR = 0.2;

module.exports = function() {
	var ui = Ti.UI.createWindow({
		backgroundColor : 'white'
	});

	var model = {
		radiostations : require('model/radiostations'),
		currentstation : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0),
		φ : 0
	};
	model.radiostations.forEach(function(station) {

	});
	var wheel = Ti.UI.createView({
		top:300,
		/*		width : 1100,
		 height : 1100,*/
		bottom : -300
	});
	model.radiostations.forEach(function(station, ndx) {
		var image = '/images/' + station.logo.toLowerCase() + '.png';
		var angle = 360 / model.radiostations.length * ndx;
		var xpos = Math.cos(angle * (Math.PI / 180));
		var ypos = Math.sin(angle * (Math.PI / 180));
		wheel.add(Ti.UI.createView({
			backgroundImage : image,
			touchEnabled : false,
			width : 200,
			height : 200,
			center : {
				x : xpos * 300,
				y : ypos * 300
			},
			transform : Ti.UI.create2DMatrix({
				rotate : angle,
				translate : [xpos*300,ypos*300]
			})

		}));
	});
	var handler = Ti.UI.createScrollView({
		scrollType : 'horizontal',
		backgroundColor : 'transparent'
	});
	handler.add(Ti.UI.createView({
		backgroundColor : 'transparent',
		width : BIG
	}));

	var lastx = 0;
	handler.addEventListener('scroll', function(_e) {
		var φ = _e.x * GEAR;
		//φ = (φ - φ % SEGMENTS);
		wheel.setTransform(Ti.UI.create2DMatrix({
			rotate : φ,
		}));
		lastx = _e.x;

	});

	ui.add(wheel);
	ui.add(handler);
	handler.setContentOffset({
		x : BIG / 2,
		y : 0
	});
	return ui;
};
