var CircularProgress = require('de.marcelpociot.circularprogress');

var Module = function(options) {
	console.log(options.index);
	var self = CircularProgress.createProgressView({
		height : 100-10*options.index,
		width : 100-10*options.index,
		opacity : 0.7,
		progress : 0.05,
		zIndex : 999999,
		thicknessRatio : 0.1,
		roundedCorners : false,
		progressTintColor : 'gray',
		trackTintColor : 'transparent',
		progress : 0,
		animatedProgress : true
	});

	require('vendor/cachedimage')({
		onprogress : function(_progress) {
			self.progress = _progress;
		},
		onload :function() {
			self.hide();
		},
		url : options.url,
		view : options.view,
	});
	return self;
};
module.exports = Module;
