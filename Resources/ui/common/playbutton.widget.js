const PLAY = '/images/_PLAY_.png', PAUSE = '/images/_PAUSE_.png';

module.exports = function(onClick) {
	const $ = Ti.UI.createView({
		width : 66,
		touchFeedback : true,
		touchFeedbackColor : "#808080",
		elevation : 20,
		height : 66,
		borderRadius : 33,
		borderWidth : 1,
		backgroundColor : "white"
	});
	$.setPlay = function() {
		$.children[0].backgroundImage = PAUSE;
	};
	$.setPause = function() {
		$.children[0].backgroundImage = PLAY;
	};

	$.add(Ti.UI.createView({
		touchEnabled : false,
		backgroundImage : PLAY
	}));
	$.addEventListener('click', function() {
		$.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 0.02
			}),
			duration : 100,
			autoreverse : true,
			repeat : 0
		});
		onClick();
	});
	return $;
};