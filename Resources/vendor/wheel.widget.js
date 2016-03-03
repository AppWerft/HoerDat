module.exports = function(_args) {
	var options = {
		segments : _args.segmentIcons,
		iconsize : _args.iconSize || 200,
		radius : _args.radius,
		gear : _args.gear || 0.2,
		verticalOffset : _args.verticalOffset || 100,
		activesegment : _args.activeSegment || 0
	};
	if (options.radius == undefined)
		options.radius = options.iconsize * 3;
	var activesegment = options.activesegement;
	var $ = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL
	});
	var WHEELSIZE = 2 * options.radius + options.iconsize * 1.3;
	console.log('WHEELSIZE=' + WHEELSIZE);
	if (!Array.isArray(options.segments)) {
		return null;
	}
	var degree_of_segment = 360 / options.segments.length;
	var BIG = 3600 / options.gear;
	/* Generating of wheel */
	var wheelView = Ti.UI.createView({
		top : options.verticalOffset,
		bottom : options.verticalOffset,

		width : WHEELSIZE,
		height : WHEELSIZE,
	});
	options.segments.forEach(function(segment, ndx) {// adding of station logos
		var α = degree_of_segment * ndx + 90;
		var center = {
			x : WHEELSIZE / 2 + Math.cos(α * Math.PI / 180) * options.radius,
			y : WHEELSIZE / 2 + Math.sin(α * Math.PI / 180) * options.radius
		};
		wheelView.add(Ti.UI.createView({
			backgroundImage : segment,
			width : options.iconsize,
			height : options.iconsize,
			center : center,
			transform : Ti.UI.create2DMatrix({
				rotate : degree_of_segment * ndx + 180,
				
			})
		}));
		/*wheelView.toImage(function(blob) {// making screenshot to save the CPU
		 require('ti.permissions').requestPermissions(['android.permission.WRITE_EXTERNAL_STORAGE'], function(_e) {
		 if (_e.success) {
		 var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'bigwheel.png');
		 file.write(blob);
		 var image = file.read();
		 wheelView.removeAllChildren();
		 wheelView.backgroundImage = image.nativePath;
		 }
		 });
		 });*/
	});
	var handler = Ti.UI.createScrollView({
		scrollType : 'horizontal',
		backgroundColor : 'transparent',
		contentOffset : {
			x : BIG / 2,
			y : 0
		}
	});
	handler.add(Ti.UI.createView({
		backgroundColor : 'transparent',
		width : BIG
	}));
	var lastφ = 0;
	var lasttime = new Date().getTime();
	var matrix = Ti.UI.create2DMatrix();

	function onScrollFn(_e) {
		var φ = (BIG / 2 - _e.x) * options.gear;
		wheelView.removeEventListener('postlayout', onPostlayoutFn);
		setTimeout(function() {
			if (Math.abs(lastφ - φ) < .1)
				wheelView.addEventListener('postlayout', onPostlayoutFn);
		}, 10);
		lastφ = φ;
		wheelView.setTransform(matrix.rotate(φ));
		//}
	}

	function onPostlayoutFn() {
		var ndx = -Math.round(((lastφ + 180) % 360) / degree_of_segment);
		activesegment = ndx % degree_of_segment;
		if (options.segments[activesegment]) {
			if ( typeof $.onChange == 'function') {
				$.onChange(activesegment);
			}
		}
	}
	handler.addEventListener('scroll', onScrollFn);
	wheelView.addEventListener('postlayout', onPostlayoutFn);
	$.getActiveSegment = function() {
		return parseInt(activesegment);
	};
	$.add(wheelView);
	$.add(handler);
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget