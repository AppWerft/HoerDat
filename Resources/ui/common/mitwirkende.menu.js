var АктйонБар = require('com.alcoapps.actionbarextras'),
    Moment = require('vendor/moment');

module.exports = function(_e) {
    var win = _e.source;
    var data = win.data;
    АктйонБар.title = data.title.trim();
    АктйонБар.subtitle = 'Mitwirkende';
    АктйонБар.titleFont = "Rambla-Bold";
    АктйонБар.backgroundColor = "#225588";
    АктйонБар.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
         activity.actionBar.displayHomeAsUp = true;
        activity.onCreateOptionsMenu = function(_e) {
        };
        activity.actionBar.logo = data.logo;
        activity.actionBar.onHomeIconItemSelected = function() {
            win.close();
        };
    }
};
