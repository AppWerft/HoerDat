var АктйонБар = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function(_openevent) {
	АктйонБар.title = 'HörDat';
	АктйонБар.subtitle = 'Dein Hörspielkalender';
	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	АктйонБар.backgroundColor = "#225588";
	console.log("_openevent");
	if (!_openevent.source)
		return;
	var activity = _openevent.source.getActivity();

	if (activity) {
		activity.onDestroy = function() {
			
		};
		console.log("_openevent activity");
		activity.onCreateOptionsMenu = function(_menu) {
			console.log("_openevent onCreateOptionsMenu");
			const menuItem = _menu.menu.add({
				title : 'Audio',
				icon : Ti.App.Android.R.drawable.ic_action_audio,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			});
			menuItem && menuItem.addEventListener("click", function(_e) {
				require('ui/common/audioselector.widget')();
			});
			/*
			 * _menu.menu.add({ title : 'Suche', icon :
			 * Ti.App.Android.R.drawable.ic_action_search, showAsAction :
			 * Ti.Android.SHOW_AS_ACTION_IF_ROOM, }).addEventListener("click",
			 * function(_e) { require('ui/common/search.window')().open(); });
			 */
			/*
			 * _menu.menu.add({ title : 'Airlino', icon :
			 * Ti.App.Android.R.drawable.airlino, showAsAction :
			 * Ti.Android.SHOW_AS_ACTION_IF_ROOM, }).addEventListener("click",
			 * function(_e) { var Airlino = require("de.appwerft.airlino");
			 * Airlino.connect({ onSuccess : function(_e) {
			 * Ti.UI.createNotification({ message : "Airlino gefunden \n" +
			 * _e.endpoint }).show(); }, onError : function() { }, timeout : 5
			 * }); });
			 */
		};
		var last = {};
		activity.invalidateOptionsMenu();
	}
//	require('vendor/versionsreminder')();
};
