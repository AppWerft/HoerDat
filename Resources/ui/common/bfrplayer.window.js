const Permissions = require('vendor/permissions');
const TEMPLATES = ['pool_online'];
const ABX = require('com.alcoapps.actionbarextras');
const PATH = '/images/bfr/%s.png';

module.exports = function(station) {
    console.log(">>>>>>>>bfrplayer.window");
    // // START /////
    var $ = Ti.UI.createWindow({
        backgroundImage : '/images/bg.png',
    });
    const Streamer = require('vendor/audioplayer.adapter');
    Streamer.init($, "applogo");
    var lastStatus = "STOPPED";
    var currentStation = null;
    var PlayerView = null;
    function stopPlayer() {
        Streamer.stop();
    }

    function playStation(station) {
        if (lastStatus == "PLAYING")
            Streamer.stop();
        else {
            const playOpts = {
                url : station.url,
                station : station.radio,
                logo : station.image,
                title : station.radio,
                color : 'silver',
                icon : "applogo"
            };

            playOpts.lifecycleContainer = $;
            Streamer.play(playOpts, //
            function(status) {
                console.log("Player=" + status);
                if (status == 3) {
                    $.actionView && $.actionView.hide();
                }
            }, //
            function() {
                $.close();
            }, //
            function(p) {
                PlayerView && PlayerView.setProgress(p);
            });
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

    $.addEventListener('close', function() {
        stopPlayer();
        $.removeAllChildren();
        $ = null;
    });
    $.addEventListener('open', _e => {
        ABX.title = station.radio;
        ABX.backgroundColor = "#225588";
        ABX.subtitle = station.art;
        ABX.titleFont = "Rambla-Bold";
        ABX.subtitleColor = "#fff";
        require('ti.immersivemode').hideSystemUI();
       // const activity = $.activity;
        $.actionView = require("ti.animation").createAnimationView({
            file : '/gears.json',
            loop : true,
            width : 45,
            height : 45,
            borderRadius : 22.5,
            autoStart : true,
            transform : Ti.UI.create2DMatrix({
                scale : 1.1
            })
        });
        if ($.activity != undefined && $.activity.actionBar != undefined) {
            $.activity.onCreateOptionsMenu = _menu => {
                var menuItem = _menu.menu.add({
                    title : "",
                    actionView : $.actionView,
                    showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
                });
                menuItem.expandActionView();
                $.activity.actionBar.displayHomeAsUp = true;
                $.activity.invalidateOptionsMenu();
                $.activity.actionBar.onHomeIconItemSelected = () => {
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
