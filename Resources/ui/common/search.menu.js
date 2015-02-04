var abx = require('com.alcoapps.actionbarextras');

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    abx.title = 'HörDat-Suche';
    abx.subtitle = win.searchItem.a;
    abx.titleFont = "Rambla-Bold";
    abx.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(e) {
            e.menu.clear();
        };
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            win.close();
        };
    }
};
