var abx = require('com.alcoapps.actionbarextras');

var crons = [];

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    abx.title = data.title;
    abx.subtitle = data.autor;
    abx.titleFont = "Rambla-Bold";
    abx.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        console.log('Info: activity found');
        activity.onCreateOptionsMenu = function(e) {
            e.menu.clear();
            activity.actionBar.displayHomeAsUp = true;    
        };
         activity.actionBar.homeButtonEnabled = true;            
        activity.actionBar.logo = data.logo;
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            win.close();
        };
    }
};
