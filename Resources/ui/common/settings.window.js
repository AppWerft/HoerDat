const ABX = require('com.alcoapps.actionbarextras');
const PATH = '/images/stationlogos3/%s.png';


module.exports = function() {
    var $ = Ti.UI.createWindow({
        backgroundImage : '/images/bg.png',
        separatorStyle : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE,
        separatorColor : 'gray'
    });
    $.content = Ti.UI.createTableView({
        sections : [Ti.UI.createTableViewSection({
            headerView : require("ui/common/headerview.widget")('Hörspielkalender'),
        }), Ti.UI.createTableViewSection({
            headerView: require("ui/common/headerview.widget")('RadioPlayer'),
        }), Ti.UI.createTableViewSection({
            headerView : require("ui/common/headerview.widget")('Hörspieldepot')
        })],
        backgroundColor : 'white'
    });
    $.content.sections[0].add(require('ui/settings/calendar.sound')());
    $.content.sections[0].add(require('ui/settings/calendar.vibration')());
    $.content.sections[0].add(require('ui/settings/calendar.before')());
    $.content.sections[0].add(require('ui/settings/calendar.after')());
    
    
    $.content.sections[1].add(require('ui/settings/radio.swipe')());
    $.content.sections[1].add(require('ui/settings/radio.dblclick')());
    $.content.sections[1].add(require('ui/settings/radio.vis')());
    $.content.sections[2].add(require('ui/settings/hoerspiel.vis')());
    $.content.sections[2].add(require('ui/settings/hoerspiel.remove')());
    $.add($.content);
    $.addEventListener('close', function() {
        $.removeAllChildren();
        $ = null;
    });
    $.addEventListener('open', function(_e) {
       
  
        require('ti.immersivemode').hideSystemUI();
        ABX.title = 'Einstellungen';
         ABX.subtitle = '… noch nicht voll wirksam …';
        ABX.backgroundColor = "#225588";
        ABX.titleFont = "Rambla-Bold";
        ABX.subtitleColor = "#fff";
        const activity = $.activity;
        if (activity != undefined && activity.actionBar != undefined) {
            activity.onCreateOptionsMenu = function(e) {
                activity.actionBar.displayHomeAsUp = true;
                activity.actionBar.onHomeIconItemSelected = function() {
                    $.close({
                        activityEnterAnimation : Ti.Android.R.slide_in_left,
                        activityExitAnimation : Ti.Android.R.slide_out_right
                    });
                };
            };
        } else
            console.log("win has no activity");
    });
    return $;
};
// https://github.com/kgividen/TiCircularSliderBtnWidget