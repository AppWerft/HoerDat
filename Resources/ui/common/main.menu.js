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
		console.log("_openevent activity");
		activity.onCreateOptionsMenu = function(_menu) {
			console.log("_openevent onCreateOptionsMenu");
			const menuItem = _menu.menu.add({
				title : 'Über uns',
				icon : Ti.App.Android.R.drawable.ic_action_about,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			});
			menuItem && menuItem.addEventListener("click", function(_e) {
				require('ui/common/about.window')().open();
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
		/*
		 * var Airlino= require("de.appwerft.airlino"); /*Airlino.isAvailable({
		 * onResult: function(e) { console.log(e.result); } });
		 * Airlino.startScan({ onSuccess: function(e) { console.log(e.result); },
		 * onError: function(e) { console.log(e); } });
		 */
		/*
		 * activity.onPause = function() { console.log('onPause <<<<<<<<<<<<<<<<<<<<<<<<<<<');
		 * last.title = АктйонБар.title; last.subtitle = АктйонБар.subtitle; };
		 * activity.onResume = function() { console.log('onResume
		 * >>>>>>>>>>>>>>>>>>>>>>>>>>>'); АктйонБар.title = last.title ||
		 * 'HörDat'; АктйонБар.subtitle = last.subtitle || 'Dein
		 * Hörspielkalender'; };
		 */
		Ti.Gesture
				.addEventListener(
						'orientationchange',
						function() {
							if (Ti.Platform.displayCaps.platformHeight > Ti.Platform.displayCaps.platformWidth) {
								activity.actionBar.show();
							} else
								activity.actionBar.hide();
						});

	}
//	require('vendor/versionsreminder')();
};
