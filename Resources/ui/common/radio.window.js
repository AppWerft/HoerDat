var TiCircularSlider = require('de.marcelpociot.circularslider');

module.exports = function() {
    var reStoreFunc = function() {
        Ti.Media.vibrate();
        console.log('reStoreFunc');
        return;
        model.lastactivestation = Ti.App.Properties.getInt('LAST', 0);
        console.log('readLAST: ' + model.lastactivestation);
        stationviews.forEach(function(view, ndx) {
            view.animate({
                duration : 400,
                transform : Ti.UI.create2DMatrix({
                    rotate : model.lastactivestation * 360 / model.stations.length + 360 / model.stations.length * ndx + 360,
                    anchorPoint : anchorPoint
                })
            });

        });
    };
    var ui = Ti.UI.createWindow({
        backgroundColor : 'white'
    });
    var player = Ti.Media.createAudioPlayer({
        allowBackground : true,
        volume : 1
    });
    var model = {
        stations : require('model/stations'),
        activestationindex : 0,
        φ : 0

    };
    var segment = 360 / model.stations.length;
    var statuslog = Ti.UI.createLabel({
        bottom : 0,
        height : 20,
        backgroundColor : 'black',
        width : Ti.UI.FILL,
        zIndex : 9999,
        color : 'silver',
        textAlign : 'center',
        text : '✻ ✻ ✻'
    });

    var container = Ti.UI.createView({
        bottom : '25%'
    });
    ui.add(container);
    var sliderView = TiCircularSlider.createView({
        height : 300,
        width : 300,
        lineWidth : 1,
        filledColor : 'transparent',
        unfilledColor : 'grey'
    });
    sliderView.addEventListener('change', function(e) {
        Ti.API.info("Value is: ", e.value);
    });

    var stationviews = [];
    var anchorPoint = {
        x : 0.5,
        y : 3.2
    };
    model.lastactivestation = Ti.App.Properties.getInt('LAST', 0);
    for (var i = 0; i < model.stations.length; i++) {
        stationviews[i] = Ti.UI.createImageView({
            image : '/images/' + model.stations[i].logo.toLowerCase() + '.png',
            width : 200,
            height : 200,

            transform : Ti.UI.create2DMatrix({
                rotate : segment * (model.lastactivestation + i),
                anchorPoint : anchorPoint
            })
        });
        container.add(stationviews[i]);
    }
    var control = Ti.UI.createView({
        bottom : 40,
        width : 100,
        height : 100,
        backgroundImage : '/images/play.png'
    });
    ui.circleProgress = require('vendor/circularprogress')({
        percent : 0,
        size : 100,
        margin : 1,
        zIndex : 901,
        progressColor : '#427aa7',
        topper : {
            color : '#fff',
            size : 225
        },
        font : {
            visible : false
        }
    });
    ui.add(control);
    ui.add(ui.circleProgress);

    ui.add(statuslog);
    /* Events */
    // ui.addEventListener('focus', reStoreFunc);
    // ui.addEventListener('open', reStoreFunc);
    ui.getActivity().onResume = reStoreFunc;
    ui.getActivity().onRestart = reStoreFunc;
    ui.addEventListener('swipe', function(_e) {
        if (_e.direction == 'down' || _e.direction == 'up')
            return;
        control.backgroundImage = '/images/leer.png';
        player.stop();
        player.release();
        statuslog.setText('Radio angehalten.');
        model.activestationindex = (_e.direction == 'left')//
        ? (model.activestationindex + model.stations.length + 1) % model.stations.length//
        : (model.activestationindex + model.stations.length - 1) % model.stations.length;
        Ti.App.Properties.setInt('LAST', model.activestationindex);

        var name = model.stations[model.activestationindex].logo;
        statuslog.setText('Könnte jetzt ' + name + ' zuschalten.');

        model.φ = (_e.direction == 'left') ? model.φ - segment : model.φ + segment;
        stationviews.forEach(function(view, ndx) {
            view.animate({
                duration : 400,
                transform : Ti.UI.create2DMatrix({
                    rotate : model.φ + segment * ndx,
                    anchorPoint : anchorPoint
                })
            });

        });
        control.backgroundImage = '/images/play.png';
    });
    control.addEventListener('click', function() {
        control.backgroundImage = '/images/leer.png';
        var name = model.stations[model.activestationindex].logo;
        if (player.isPlaying()) {
            player.stop();
            statuslog.setText('Radio ' + name + ' gestoppt');
            return;
        }
        control.opacity = 0.4;
        statuslog.setText('Besorge Radio-Adresse für ' + name);
        player.release();
        require('controls/resolveplaylist')({
            playlist : model.stations[model.activestationindex].playlist,
            stream : model.stations[model.activestationindex].stream,
            onload : function(_url) {
                statuslog.setText('Radio-Adresse erkannt, starte jetzt Radio');
                control.opacity = 1;
                player.setUrl(_url);
                player.play();
            },
            onerror : function() {
                statuslog.setText('FEHLER: Radio-Adresse nicht erkannt.');
                control.opacity = 1;
            }
        });
    });
    player.addEventListener('change', function(_e) {
        var name = model.stations[model.activestationindex].name || model.stations[model.activestationindex].logo;

        console.log(_e.description + '  ' + _e.state);
        switch (_e.state) {
        case Ti.Media.AudioPlayer.STATE_BUFFERING:
            //1
            statuslog.setText('Daten werden gebuffert.');
            break;
        case Ti.Media.AudioPlayer.STATE_INITIALIZED:
            statuslog.setText('Initialisierung.');
            break;
        case Ti.Media.AudioPlayer.STATE_PAUSED:
            statuslog.setText('Radio pausiert');
            break;
        case Ti.Media.AudioPlayer.STATE_PLAYING:
        case 3:
            //3
            statuslog.setText('Radio spielt ' + name + ' .');
            control.backgroundImage = '/images/stop.png';
            break;
        case Ti.Media.AudioPlayer.STATE_STARTING:
        case 4:
            // 3
            statuslog.setText('Radio ' + name + ' wird gestartet.');
            control.backgroundImage = '/images/stop.png';
            break;
        case 5:
            //5
            // statuslog.setText('Radio ' + name + ' ist verstummt');
            control.backgroundImage = '/images/play.png';
            break;
        case Ti.Media.AudioPlayer.STATE_STOPPING:
            //6
            statuslog.setText('Radio ist am Verstummen.');
            control.backgroundImage = '/images/play.png';
            break;
        case Ti.Media.AudioPlayer.STATE_WAITING_FOR_DATA:
            statuslog.setText('Radio wartet auf Daten.');
            break;
        case Ti.Media.AudioPlayer.STATE_WAITING_FOR_QUEUE:
            statuslog.setText('Radio wartet aufs Warten');
            break;
        }
    });

    return ui;
};
