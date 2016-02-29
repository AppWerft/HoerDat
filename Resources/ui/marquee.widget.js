module.exports = function() {
	var $ = Ti.UI.createView({
		top : 5,
		left : 0,
		right : 0,
		height : 50,
		color : '#999',
	});
	$.add(Ti.UI.createLabel({
		left : 0,
		right : 0,
		zIndex:99,
		height : Ti.UI.FILL,
		wordWrap : false,
		textAlign:'center',
		color : '#888',
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		font : {
			fontSize : 36,
			fontFamily : 'Rambla-Bold'
		}
	}));
	// left and right blurring 
	$.add(Ti.UI.createImageView({
		left : 0,
		height : 50,
		width : Ti.UI.SIZE,
		image : '/images/leftblur.png'
	}));
	$.add(Ti.UI.createImageView({
		right : 0,
		height : 50,
		width : Ti.UI.SIZE,
		image : '/images/rightblur.png'
	}));
	// method to overwrite marquee
	$.setText = function(_t) {
		$.children[0].setText(_t);
	};
	return $;
};
