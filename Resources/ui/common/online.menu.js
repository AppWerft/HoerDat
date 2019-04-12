var abx = require('com.alcoapps.actionbarextras');

module.exports = function(_e) {
	var win = _e.source;
	abx.title = 'ARD - Hörspiele';
	abx.backgroundColor = "#225588";
	abx.subtitle = 'Runderladerampe';
	abx.titleFont = "Rambla-Bold";
	abx.subtitleColor = "#ccc";
	var activity = _e.source.getActivity();
	if (activity) {
			activity.actionBar.displayHomeAsUp = true;
			activity.actionBar.onHomeIconItemSelected = function() {
				win.close();
			};
			activity.invalidateOptionsMenu();
	}
};
