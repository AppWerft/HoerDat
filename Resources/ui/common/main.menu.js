var АктйонБар = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function(_openevent) {
	АктйонБар.title = 'HörDat';
	АктйонБар.subtitle = 'Dein Hörspielkalender';
	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	АктйонБар.backgroundColor = "#225588";
	Ti.App.addEventListener('app:set', function(_e) {
		console.log(_e);
		АктйонБар.subtitle = _e.subTitle;
	});
	var activity = _openevent.source.getActivity();
	if (activity) {
		activity.onCreateOptionsMenu = function(_menu) {
			console.log('Info: onCreateOptionsMenu triggered');
			activity.actionBar.displayHomeAsUp = false;
			_menu.menu.add({
				title : 'Über uns',
				icon : Ti.App.Android.R.drawable.ic_action_about,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			}).addEventListener("click", function(_e) {
				require('ui/common/about.window')().open();
			});
		};
		activity.invalidateOptionsMenu();
		Ti.Gesture.addEventListener('orientationchange', function() {
			if (Ti.Platform.displayCaps.platformHeight > Ti.Platform.displayCaps.platformWidth) {
				activity.actionBar.show();
			} else activity.actionBar.hide();
		});

	}
	require('vendor/versionsreminder')();
};
