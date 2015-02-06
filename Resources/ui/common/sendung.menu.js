var АктйонБар = require('com.alcoapps.actionbarextras');

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    АктйонБар.title = data.title;
    АктйонБар.subtitle = data.autor;
    АктйонБар.titleFont = "Rambla-Bold";
    АктйонБар.subtitleColor = "#ccc";
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
