var АктйонБар = require('com.alcoapps.actionbarextras'),
    Moment = require('vendor/moment');

module.exports = function(_e) {
	var win = _e.source;
	var data = win.data;
	АктйонБар.title = data.title.trim();
	АктйонБар.subtitle = data.autor;
	АктйонБар.backgroundColor = "#225588";
	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	var activity = _e.source.getActivity();
	if (activity) {
		activity.onCreateOptionsMenu = function(_e) {
			_e.menu.clear();
			var seconds = Moment(data.time_isostring).unix() - Moment().unix();
			if (data.mitwirkende)
				_e.menu.add({
					title : 'Mitwirkende',
					icon : Ti.App.Android.R.drawable.ic_action_person,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				}).addEventListener("click", function(_e) {
					require('ui/common/mitwirkende.window')(data).open();
				});

			/*if ((data.stream || data.playlist) && seconds)
				_e.menu.add({
					title : 'Hören',
					icon : Ti.App.Android.R.drawable.ic_action_play,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				}).addEventListener("click", function(_e) {
					require('controls/resolveplaylist')({
						playlist : data.playlist,
						onload : function(_url) {
							var player = Ti.Media.createAudioPlayer({
								url : _url
							});
							player.start();
						},
						onerror : function() {
						}
					});
				});
			*/
			if (seconds > 0) {
				_e.menu.add({
					title : 'Erinnerung',
					icon : Ti.App.Android.R.drawable.ic_action_timer,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				}).addEventListener("click", function(_e) {
					var Reminder = require('controls/reminder.adapter').createReminder(data);
				});
			}
				
			activity.actionBar.displayHomeAsUp = true;
			
		};
		//activity.actionBar.logo = data.logo;
		activity.actionBar.homeButtonEnabled = true;
		activity.actionBar.onHomeIconItemSelected = function() {
			win.removeAllChildren();
			win.close();
		};
	}
};
