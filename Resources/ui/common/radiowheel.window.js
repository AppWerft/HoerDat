const OFFSET = 100,
    TILESIZE = 210,
    RADIUS = 540,
    WHEELSIZE = 2 * RADIUS + TILESIZE * 1.3;

module.exports = function() {
	var model = {
		radiostations : require('model/radiostations'),
		currentstation : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0),
		φ : 0
	};
	var degrees_of_pie = 360 / model.radiostations.length;
	var gear = 0.1;
	BIG = 3600 / gear;
	var ui = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	model.radiostations.forEach(function(station) {
	});
	
	/* Generating of wheel */
	var wheel = Ti.UI.createView({
		top : OFFSET,
		width : WHEELSIZE,
		height : WHEELSIZE,
		bottom : -OFFSET
	});
	model.radiostations.forEach(function(station, ndx) { // adding of station logos
		var α = 360 / model.radiostations.length * ndx * (Math.PI / 180);
		wheel.add(Ti.UI.createView({
			backgroundImage :  '/images/' + station.logo.toLowerCase() + '.png',
			touchEnabled : false,
			width : TILESIZE,
			height : TILESIZE,
			center : {
				x : WHEELSIZE / 2 + Math.cos(α) * RADIUS,
				y : WHEELSIZE / 2 + Math.sin(α) * RADIUS
			},
			transform : Ti.UI.create2DMatrix({
				rotate : 360 / model.radiostations.length * ndx + 90
			})
		}));
		wheel.toImage(function(blob) {// making screenshot to save the CPU 
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'bigwheel.png');
			file.write(blob);
			var image = file.read();
			wheel.removeAllChildren();
			wheel.backgroundImage = image.nativePath;
		});

	});
	var handler = Ti.UI.createScrollView({
		scrollType : 'horizontal',
		backgroundColor : 'transparent'
	});
	handler.add(Ti.UI.createView({
		backgroundColor : 'transparent',
		width : BIG
	}));

	var lastφ = 0;
	var lasttime = new Date().getTime();
	var matrix = Ti.UI.create2DMatrix();
	function onScrollFn(_e) {
		var φ = -_e.x * gear;
		lastφ = φ;
		var time = new Date().getTime();
		if (time - lasttime > 0)
			wheel.setTransform(matrix.rotate(φ));
		lasttime = time;
	}


	handler.addEventListener('scroll', onScrollFn);

	handler.addEventListener('touchend', function(_e) {
		return;
		setTimeout(function() {
			var φ = Math.round(lastφ / degrees_of_pie) * degrees_of_pie;
			//+ degrees_of_pie / 4;
			//console.log(φ);
			wheel.animate({
				transform : Ti.UI.create2DMatrix({
					rotate : φ,
					duration : 50
				})
			});
		}, 2000);

	});
	ui.add(wheel);
	ui.add(handler);
	handler.setContentOffset({
		x : BIG / 2,
		y : 0
	});
	return ui;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget