


exports.createView = function() {
	const $ = Ti.UI.createView({
		backgroundColor : "#6000",
		touchEnabled : false,
		pubbleParent : false,
		zIndex : 998
	});
	$.add(require("ti.animation").createAnimationView({
		file : '/images/loading.json',
		loop : true,
		width : 320,
		height : 320,
		zIndex : 999,
		touchEnabled : false,
		autoStart : true
	}));
	return $;
};
