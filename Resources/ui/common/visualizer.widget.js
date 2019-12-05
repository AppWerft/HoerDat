module.exports = function() {
	const $ = Ti.UI.createView({
		bottom : 0,
		touchEnabled : false,
		zIndex : 9999,
		height : "60%"
	});
	$.add(require('ti.audiovisualizerview').createView({
		touchEnabled : false,
		bargraphRenderer : {
			barWidth : Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor / 7 * Ti.Platform.displayCaps.logicalDensityFactor,
			color : '#225588',
			divisions : 7
		}
	}));
	return $;
};
