var abx = require('com.alcoapps.actionbarextras');

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    abx.title = 'ARD - Hörspiele';
    abx.backgroundColor = "#225588";
    abx.subtitle = 'Runderladerampe';
    abx.titleFont = "Rambla-Bold";
    abx.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(e) {
            activity.actionBar.displayHomeAsUp = true;
            e.menu.clear();
        };
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            win.close();
        };
    }
};
