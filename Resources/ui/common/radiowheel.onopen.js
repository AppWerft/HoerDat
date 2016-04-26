var Visualizer = require('ti.audiovisualizerview');

module.exports = function(_e) {
	console.log('Info: apiName=' + _e.source.apiName);
	require('vendor/permissions').requestPermissions(['RECORD_AUDIO', 'MODIFY_AUDIO_SETTINGS'], function(_success) {
		if (_success == true) {
			var window = _e.source;
			$.visualizerView = Visualizer.createView({
				height : 90,
				top : 30,
				left : 20,
				lifecycleContainer : window,
				right : 20,
				touchEnabled : false,
				audioSessionId : 0, //playStopControlView.audioSessionId || 0,
				width : Ti.UI.FILL,
			});
			window.visualizerView.addEventListener('ready', function() {
				window.visualizerView.addBarGraphRenderers();
			});
			window.add($.visualizerView);
		} else
			console.log('Pheelicks: WRONG PERMISSIONS');
	});
}; 