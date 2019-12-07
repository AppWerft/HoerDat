const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

module.exports = function(opts) {
	const $ = Ti.UI.createScrollView({
		scrollType : 'vertical',
		layout : 'vertical',
		backgroundColor : 'white',
		top : SCREENWIDTH
	});
	$.add(Ti.UI.createLabel({
		text : opts.title,
		left : 10,
		right : 10,
		top : 10,
		color : '#225588',
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		font : {
			fontSize : 24,
			fontWeight : 'bold',
			fontFamily : 'Rambla-Bold'
		}

	}));
	if (opts.author && opts.author.length) {
		$.add(Ti.UI.createLabel({
			text : opts.author,
			left : 10,
			right : 10,
			top : 5,
			color : '#444',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 18,
				fontWeight : 'bold',
				fontFamily : 'Rambla-Bold'
			}

		}));
	}
	$.add(Ti.UI.createLabel({
		text : opts.description + "\n\n\n	",
		left : 10,
		right : 10,
		font : {
			fontSize : 18,
			fontFamily : 'Rambla'
		},
		top : 5,
		color : 'black',
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE
	}));
	return $;
};
