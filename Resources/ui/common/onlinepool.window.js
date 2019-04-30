const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0, STATUS_PROGRESS = 1, STATUS_SAVED = 2;
const TEMPLATES = [ 'pool_online' ];
const ABX = require('com.alcoapps.actionbarextras');

module.exports = function(_tabgroup, renderParentSections) {
	var started = false;
	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup
	});
	$.addEventListener('close', renderParentSections);
	$.addEventListener('open', function(_e) {
		ABX.title = 'ARD - Hörspiele';
		ABX.backgroundColor = "#225588";
		ABX.subtitle = 'Runderladerampe';
		ABX.titleFont = "Rambla-Bold";
		ABX.subtitleColor = "#ccc";
		const activity = $.activity;
		if (activity != undefined && activity.actionBar != undefined) {
			activity.onCreateOptionsMenu = function(e) {
				activity.actionBar.displayHomeAsUp = true;
				activity.actionBar.onHomeIconItemSelected = function() {
					$.close();
				};
			};

			// activity.actionBar.displayHomeAsUp = true;
			// activity.invalidateOptionsMenu();
		} else
			console.log("win has no activity");
		setTimeout(function() {
			$.add(require('ui/common/onlinepool.list')());
		}, 50);
	});
	
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
