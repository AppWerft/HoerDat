var Visualizer = require('ti.audiovisualizerview');

module.exports = function(_e) {
	require('vendor/permissions').requestPermissions(['RECORD_AUDIO', 'MODIFY_AUDIO_SETTINGS'], function(_success) {
		if (_success == true) {
			var $ = _e.source;
			$.visualizerView = Visualizer.createView({
				height : 90,
				top : 30,
				left : 20,
				lifecycleContainer : $,
				right : 20,
				touchEnabled : false,
				audioSessionId : 0, //playStopControlView.audioSessionId || 0,
				width : Ti.UI.FILL,
			});
			$.visualizerView.addEventListener('ready', function() {
				$.visualizerView.addBarGraphRenderers();
			});
			$.add($.visualizerView);
		} else
			console.log('Pheelicks: WRONG PERMISSIONS');
	});
}; 