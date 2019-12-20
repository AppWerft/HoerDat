const Permissions = require('vendor/permissions');
const Gears = require("ui/common/gears.widget");
const ABX = require('com.alcoapps.actionbarextras');
const PATH = '/images/bfr/%s.png';

module.exports = function(opts, getterFunction) {
    var $ = Ti.UI.createWindow({
        backgroundImage : '/images/bg.png',
    });
    $.list = Ti.UI.createTableView({
        backgroundColor : '#aaffffff'

    });
    $.add($.list);
    gearView = Gears();
    $.add(gearView);
    getterFunction(opts.id,items => {
        if ($) {
            if (Ti.Utils.md5HexDigest(JSON.stringify(items)) !== $.list.md5)
                $.list.data = items.map(require('ui/common/bfr.row'));
            $.list.md5 = Ti.Utils.md5HexDigest(JSON.stringify(items));
            //   $.list.data = items.map(require('ui/common/bfr.row'));
            $.remove(gearView);
        }
    });
    $.addEventListener('close', function() {
        $.removeAllChildren();
        $ = null;
    });
    $.list.addEventListener('click',e => {
        require('ui/common/bfrplayer.window')(JSON.parse(e.row.itemId)).open();
    });
    $.addEventListener('open', _e => {
        ABX.title = opts.title;
        ABX.backgroundColor = "#225588";
        ABX.subtitle = opts.subtitle;
        ABX.titleFont = "Rambla-Bold";
        ABX.subtitleColor = "#fff";
        require('ti.immersivemode').hideSystemUI();
        const activity = $.activity;
        if (activity != undefined && activity.actionBar != undefined) {
            activity.onCreateOptionsMenu = _menu => {
                activity.actionBar.displayHomeAsUp = true;
                activity.invalidateOptionsMenu();
                activity.actionBar.onHomeIconItemSelected = () => {
                    $.close({
                        activityEnterAnimation : Ti.Android.R.slide_in_left,
                        activityExitAnimation : Ti.Android.R.slide_out_right
                    });
                };
            };
        }
    });
    $.open();
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
