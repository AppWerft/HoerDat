var abx = require('com.alcoapps.actionbarextras');

var crons = [];

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    console.log(data);
    abx.title = data.title;
    abx.subtitle = data.autor;
    abx.titleFont = "Rambla-Bold";
    abx.homeAsUpIcon = data.logo;
    abx.subtitleColor = "#aaa";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(e) {
            e.menu.clear();

        };
    }
    activity.actionBar.homeButtonEnabled=true;
    activity.actionBar.onHomeIconItemSelected = function() {
        win.close();
    };
};
