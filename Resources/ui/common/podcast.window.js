
const ABX = require('com.alcoapps.actionbarextras');

module.exports = function(url) {
	
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		
	});
	
	$.addEventListener('open', function(_e) {
		ABX.title = 'deutschsprachige Podcasts';
		ABX.backgroundColor = "#225588";
		ABX.subtitle = 'in Arbeit …';
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
	    

	});
	$.add(require('ui/common/podcast.list')());
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
