var ABX = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function(e) {
	const $ = e.source;
	if (!$)
		return;
	const activity = $.activity;
	if (activity) {
		$.actionBar = activity.actionBar;
		if ($.actionBar) {
			$.actionBar.displayHomeAsUp = true;
			$.actionBar.onHomeIconItemSelected = function() {
				const activeTab = $.getActiveTab();
				activeTab.window.children[0].toggleLeft();
			};
		} else
			console.log("no ACTIONBAR!!!")
		activity.onCreateOptionsMenu = function(_menu) {
			const menuItem = _menu.menu.add({
				title : 'Einstellungen',
				icon : Ti.App.Android.R.drawable.ic_action_settings,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			}).addEventListener("click", () => {require('ui/common/settings.window')().open();});
		};
		activity.invalidateOptionsMenu();
	} else
		console.log("no ACTIVITY !!");
	ABX.title = 'HörDat';
	ABX.subtitle = 'Dein Hörspielkalender';
	ABX.titleFont = "Rambla-Bold";
	ABX.subtitleColor = "#ddd";
	ABX.backgroundColor = "#225588";
};
