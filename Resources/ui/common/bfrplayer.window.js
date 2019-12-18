const Permissions = require('vendor/permissions');
const TEMPLATES = ['pool_online'];
const ABX = require('com.alcoapps.actionbarextras');
const PATH = '/images/bfr/%s.png';

module.exports = function(_tabgroup, station) {
    console.log(">>>>>>>>bfrplayer.window");
   
    const Streamer = require('vendor/audioplayer.adapter');
    Streamer.init(_tabgroup, "applogo");
    var lastStatus = "STOPPED";
    var currentStation = null;
    var PlayerView = null;
    function stopPlayer() {
        Streamer.stop();
    }

    function playStation(station) {
        if (lastStatus == "PLAYING")
            Streamer.stop();
        else  {
            const playOpts = {
                url : station.url,
                station : station['frn:radio'],
                logo : station.image,
                title : station['frn:radio'],
                color : 'silver',
             //   lifecycleContainer : _tabgroup,
                icon : "applogo"
            };
         
            playOpts.lifecycleContainer = _tabgroup;
            Streamer.play(playOpts);
        }
        currentStation = station;
    }

    function onPermission(success) {
        if (success) {
            PlayerView && PlayerView.addVisualization();
            playStation(station);

        }

    }

    var started = false;
    // // START /////
    var $ = Ti.UI.createWindow({
        backgroundImage : '/images/bg.png',
    });
    $.addEventListener('close', function() {
        stopPlayer();
        $.removeAllChildren();
        $ = null;
    });
    $.addEventListener('open', _e => {
        ABX.title = station['frn:radio'];
        ABX.backgroundColor = "#225588";
        ABX.subtitle = station.category;
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
        } else
            console.log("win has no activity");
        PlayerView = require('ui/common/bfrplayer.widget').createView(station);
        PlayerView && $.add(PlayerView.getView());
        Permissions.requestPermissions(['RECORD_AUDIO'], onPermission);
    });
    return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
