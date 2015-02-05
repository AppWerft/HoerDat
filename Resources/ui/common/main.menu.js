var abx = require('com.alcoapps.actionbarextras');

/* this module will called from _e.source on open event */
module.exports = function(_e) {
    console.log('Info: tabgroup opened');
    var cron;
    abx.title = 'HörDat';
    abx.titleFont = "Rambla-Bold";
    abx.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        console.log('Info: activity found');
        console.log(activity);
        activity.onCreateOptionsMenu = function(e) {
            console.log('Info: onCreateOptionsMenu triggered');
            activity.actionBar.displayHomeAsUp = false;
            //e.menu.clear();
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
        // activity.actionBar.logo = data.logo;
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            _e.source.close();
        };
    }
    _e.source.addEventListener('focus', function() {
        console.log('tabgroup focused');
        cron = setInterval(function() {
            abx.subtitle = require('vendor/moment')().format('HH:mm:ss');
        }, 1000);
    });
    _e.source.addEventListener('blur', function() {
        console.log('tabgroup blured');
        cron && clearInterval(cron);
    });
    cron = setInterval(function() {
        abx.subtitle = require('vendor/moment')().format('HH:mm');
    }, 60000);
    require('vendor/versionsreminder')();
};
