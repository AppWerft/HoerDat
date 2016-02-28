var АктйонБар = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function(_tabgroup) {

	АктйонБар.title = 'HörDat';
	АктйонБар.subtitle = 'Dein Hörspielkalender';

	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	АктйонБар.backgroundColor = "#225588";
	Ti.App.addEventListener('app:set', function(_e) {
		console.log(_e);
		АктйонБар.subtitle = _e.subTitle;
	});

	var activity = _tabgroup.source.getActivity();
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
		activity.actionBar.onHomeIconItemSelected = function() {
			_tabgroup.close();
		};
		activity.onResume = function() {
			//  АктйонБар.subtitle = require('vendor/moment')().format('HH:mm:ss');
			//  }, 1000);
		};
		activity.onPause = function() {
			console.log('activity paused');
			clearInterval(АктйонБар.cronjob);
		};
	}
	require('vendor/versionsreminder')();
};
