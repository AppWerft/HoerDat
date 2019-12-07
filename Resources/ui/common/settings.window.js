const ABX = require('com.alcoapps.actionbarextras');
const PATH = '/images/stationlogos3/%s.png';

module.exports = function() {
	
	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',

	});
	$.addEventListener('close', function() {
		$.removeAllChildren();
		$ = null;
	});
	$.addEventListener('open', function(_e) {
		ABX.title = 'Einstellungen';
		ABX.backgroundColor = "#225588";
		
		ABX.titleFont = "Rambla-Bold";
		ABX.subtitleColor = "#fff";
		const activity = $.activity;
		if (activity != undefined && activity.actionBar != undefined) {
			activity.onCreateOptionsMenu = function(e) {
				activity.actionBar.displayHomeAsUp = true;
				activity.actionBar.onHomeIconItemSelected = function() {
					$.close({
						activityEnterAnimation : Ti.Android.R.slide_in_left,
						activityExitAnimation : Ti.Android.R.slide_out_right
					});
				};
			};
		} else
			console.log("win has no activity");
	});
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
