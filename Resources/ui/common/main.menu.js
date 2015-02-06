var АктйонБар = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function(_e) {
    console.log('Info: tabgroup opened');
    var cron;
    АктйонБар.title = 'HörDat';
    АктйонБар.titleFont = "Rambla-Bold";
    АктйонБар.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(e) {
            console.log('Info: onCreateOptionsMenu triggered');
            activity.actionBar.displayHomeAsUp = false;
            e.menu.add({
                title : 'Über uns',
                icon : Ti.App.Android.R.drawable.ic_action_about,
                showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
            }).addEventListener("click", function(_e) {
                require('ui/common/about.window')().open();
            });
            e.menu.add({
                title : 'Einstellungen',
                icon : Ti.App.Android.R.drawable.ic_action_settings,
                showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
            }).addEventListener("click", function(_e) {
            });

        };
        activity.invalidateOptionsMenu();

        activity.actionBar.onHomeIconItemSelected = function() {
            _e.source.close();
        };
        activity.onResume = function() {
            console.log('tabgroup focused');
            cron = setInterval(function() {
                АктйонБар.subtitle = require('vendor/moment')().format('HH:mm:ss');
            }, 1000);
        };
        activity.onPause = function() {
            console.log('tabgroup blured');
            cron && clearInterval(cron);
        };
        cron = setInterval(function() {
            АктйонБар.subtitle = require('vendor/moment')().format('HH:mm:ss');
        }, 1000);
    }
    require('vendor/versionsreminder')();
};
