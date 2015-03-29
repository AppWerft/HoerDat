var АктйонБар = require('com.alcoapps.actionbarextras'),
    Moment = require('vendor/moment');

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    АктйонБар.title = data.title;
    АктйонБар.subtitle = data.autor;
    АктйонБар.titleFont = "Rambla-Bold";
    АктйонБар.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(_e) {
            _e.menu.clear();
            _e.menu.add({
                title : 'Erinnerung',
                icon : Ti.App.Android.R.drawable.ic_action_timer,
                showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
            }).addEventListener("click", function(_e) {
                console.log(data.time);
                var alarmManager = require('bencoding.alarmmanager').createAlarmManager();
                var  seconds    = Moment().diff(Moment(data.time).unix());
                var alarm = {
                    requestCode : seconds,
                    second : seconds,
                    contentTitle : data.title + '(' + data.station + ')',
                    contentText : 'beginnt in 10 Minuten',
                    playSound : true,
                    icon : Ti.App.Android.R.drawable.appicon,
                    //         sound : Ti.Filesystem.getResRawDirectory() + 'kkj', //Set a custom sound to play
                };
                alarmManager.addAlarmNotification(alarm);
                Ti.Android && Ti.UI.createNotification({
                    message : 'Hörspiel\n„' + data.title + '“\nvorgemerkt.'
                }).show();

            });

            activity.actionBar.displayHomeAsUp = true;
        };
        activity.actionBar.logo = data.logo;
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            win.close();
        };
    }
};
