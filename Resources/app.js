(function() {
	var ChromeCast = require('ti.chromecast');
	var res = ChromeCast.startMediaRouter('543FE7A7',function(_e) {
		console.log(_e);
	});
	var Window = require('ui/handheld/ApplicationWindow');
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Window).open();

})();
