var Visualizer = require('ti.audiovisualizerview');

module.exports = function(_e) {
	console.log('Info: winapiName=' + _e.source.apiName);
	console.log('Info: tabapiName=' + _e.source.tabgroup.apiName);
	require('vendor/permissions').requestPermissions(['RECORD_AUDIO', 'MODIFY_AUDIO_SETTINGS'], function(_success) {
		if (_success == true) {
			var window = _e.source;
			window.visualizerView = Visualizer.createView({
				bottom : 0,
				left : 0,
				lifecycleContainer : window.tabgroup,
				right : 0,
				touchEnabled : false,
				zIndex : -1,
				audioSessionId : 0, //playStopControlView.audioSessionId || 0,
				width : Ti.UI.FILL,
			});
			window.visualizerView.addEventListener('ready', function() {
				//window.visualizerView.addLineRenderer();
				window.visualizerView.addBarGraphRenderer({
					color : '#326598',
					width : 32.0,
				});
			});
			window.add(window.visualizerView);
		} else
			console.log('Pheelicks: WRONG PERMISSIONS');
	});
};
