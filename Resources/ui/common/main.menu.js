var ABX = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function() {
	const lifecyclecontainer = arguments[0].source;
	if (!lifecyclecontainer)
		return;
	const activity = lifecyclecontainer.activity;
	if (activity) {
		const actionBar = activity.actionBar;
		if (actionBar) {
			Ti.App.addEventListener('app:tabchanged', function(payload){
				actionBar.displayHomeAsUp = payload.hasDrawer;
			});
			actionBar.onHomeIconItemSelected = function() {
				Ti.App.fireEvent("app:toggleleft",{});
			};
		}
		activity.onCreateOptionsMenu = function(_menu) {
			/*const menuItem = _menu.menu.add({
			 title : 'Audio',
			 icon : Ti.App.Android.R.drawable.ic_action_audio,
			 showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			 });
			 menuItem && menuItem.addEventListener("click", function(_e) {
			 require('ui/common/audioselector.widget')();
			 });*/
		};
		activity.invalidateOptionsMenu();
	}
	ABX.title = 'HörDat';
	ABX.subtitle = 'Dein Hörspielkalender';
	ABX.titleFont = "Rambla-Bold";
	ABX.subtitleColor = "#ccc";
	ABX.backgroundColor = "#225588";
};
