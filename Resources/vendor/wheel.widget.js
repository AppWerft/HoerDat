module.exports = function(_args) {
	var options = {
		segments : _args.segmentIcons,
		iconsize : _args.iconSize || 200,
		radius : _args.radius,
		opacity : _args.opacity || 1.0,
		gear : _args.gear || 0.03,
		verticalOffset : _args.verticalOffset || 100,
		activesegment : _args.activeSegment || 0
	};
	if (options.radius == undefined)
		options.radius = options.iconsize * 3;
	var activesegment = options.activesegement;
	var $ = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		opacity : options.opacity || 0.9
	});
	var WHEELSIZE = 2 * options.radius + options.iconsize * 1.3;
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
	function addIcon(segment, ndx) {// adding of station logos
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
	}


	options.segments.forEach(addIcon);

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
		lastφ = φ;
		wheelView.setTransform(matrix.rotate(φ));
	}

	handler.addEventListener('scroll', onScrollFn);
	handler.addEventListener('scrollend', function(e){
		console.log(e);
	});
	//wheelView.addEventListener('postlayout', onPostlayoutFn);
	$.getActiveSegment = function() {
		var ndx = -Math.round(((lastφ + 180) % 360) / degree_of_segment);
		activesegment = (ndx + options.segments.length) % options.segments.length;
		lockIn();
		return parseInt(activesegment);
	};

	function lockIn() {
		/* to correct position */
		var φ = lastφ - degree_of_segment / 2;
		var δ = (φ / degree_of_segment - Math.round(φ / degree_of_segment)) * degree_of_segment;
		
		console.log('>>>>>>>>>>>>>> ' + (lastφ - δ) + '      δ='+δ);
		wheelView.animate({
			transform : matrix.rotate(lastφ -δ)
		});
	};
	$.setActiveSegment = function(ndx) {
	};
	$.add(wheelView);
	$.add(handler);
	wheelView.animate({
		transform : matrix.rotate(options.activesegment * degree_of_segment + degree_of_segment / 2)
	});
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget
