var abx = require('com.alcoapps.actionbarextras');


var Moment = require('vendor/moment');
module.exports = function(_e) {
    var cron = setInterval(function(){
        abx.subtitle = Moment().format('HH:mm:ss');
    },1000);
    var win = _e.source;
    var data = win.data;
    abx.title = 'HörDat';
    abx.titleFont = "Rambla-Bold";
    //abx.homeAsUpIcon = data.logo;

    abx.subtitleColor = "#ccc";
    var activity = _e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(e) {
            e.menu.clear();

        };
       // activity.actionBar.logo = data.logo;
        activity.actionBar.homeButtonEnabled = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            win.close();
        };
    }
};
