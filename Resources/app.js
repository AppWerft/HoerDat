(function() {
	
	/* starting Chromecast */
	/*var deviceManager = require('ti.chromecast').createDeviceManager();
	deviceManager.getMediaRouteSelector('DEFAULT_MEDIA_RECEIVER');
	deviceManager.addEventListener('deviceOnline', function(e) {
		var device = e.device;
	});*/
	
	var Window = require('ui/handheld/ApplicationWindow');
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Window).open();
})();
