var abx = require('com.alcoapps.actionbarextras');

module.exports = function(_e) {
    var cron;
    var tabgroup = _e.source;
    var data = tabgroup.data;
    abx.title = 'HörDat';
    abx.titleFont = "Rambla-Bold";
    abx.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(e) {
            activity.actionBar.displayHomeAsUp = false;
            e.menu.clear();
            e.menu.add({
                title : 'Über uns',
                icon : Ti.App.Android.R.drawable.ic_action_about,
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
            }).addEventListener("click", function(_e) {
            });
            e.menu.add({
                title : 'Einstellungen',
                icon : Ti.App.Android.R.drawable.ic_action_settings,
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
            }).addEventListener("click", function(_e) {
            });

        };
        // activity.actionBar.logo = data.logo;
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            tabgroup.close();
        };
    }
    tabgroup.addEventListener('focus', function() {
        console.log('Tabgroup focused');
        require('vendor/versionsreminder')();
        cron = setInterval(function() {
            abx.subtitle = require('vendor/moment')().format('HH:mm:ss');
        }, 1000);
    });
    tabgroup.addEventListener('blur', function() {
        console.log('Tabgroup blured');
        cron && clearInterval(cron);
        cron = null;
    });
};
