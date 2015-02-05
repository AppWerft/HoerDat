const anchorPoint = {
    x : 0.5,
    y : 3.2
};

module.exports = function() {
    var reStoreFunc = function() {
        Ti.Media.vibrate();
        console.log('reStoreFunc');
        return;

    };
    var ui = Ti.UI.createWindow({
        backgroundColor : 'white'
    });
    var player = Ti.Media.createAudioPlayer({
        allowBackground : true,
        volume : 1
    });

    if (Ti.App.Properties.getString('LASTRADIO', null)) {
        var model = JSON.parse(Ti.App.Properties.getString('LASTRADIO', null));

    } else {
        console.log('Info: initialization auf radioModel');
        var model = {
            stations : require('model/stations'),
            activestationindex : 0,
            φ : 0
        };
    }
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

    var stationviews = [];
    for (var i = 0; i < model.stations.length; i++) {

        stationviews[i] = Ti.UI.createImageView({
            image : '/images/' + model.stations[i].logo.toLowerCase() + '.png',
            width : 200,
            height : 200,
            transform : Ti.UI.create2DMatrix({
                rotate : segment * (model.activestationindex + i),
                anchorPoint : anchorPoint
            })
        });
        container.add(stationviews[i]);
    }
    model.φ = model.activestationindex * segment;
    var PlayStopButton = Ti.UI.createView({
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
    ui.add(PlayStopButton);
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
        PlayStopButton.backgroundImage = '/images/leer.png';
        player.stop();
        player.release();
        statuslog.setText('Radio angehalten.');
        model.activestationindex = (_e.direction == 'left')//
        ? (model.activestationindex + model.stations.length + 1) % model.stations.length//
        : (model.activestationindex + model.stations.length - 1) % model.stations.length;
        var name = model.stations[model.activestationindex].logo;
        statuslog.setText('Könnte jetzt ' + name + ' zuschalten.');

        model.φ = (_e.direction == 'left') ? model.φ - segment - 360 : model.φ + segment + 360;
        console.log(model.φ / model.stations.length);
        stationviews.forEach(function(view, ndx) {
            view.animate({
                duration : 70,
                transform : Ti.UI.create2DMatrix({
                    rotate : model.φ + segment * ndx,
                    anchorPoint : anchorPoint
                })
            });

        });
        PlayStopButton.backgroundImage = '/images/play.png';
        Ti.App.Properties.setString('LASTRADIO', JSON.stringify(model));

    });
    PlayStopButton.addEventListener('click', function() {
        PlayStopButton.backgroundImage = '/images/leer.png';
        var name = model.stations[model.activestationindex].logo;
        if (player.isPlaying()) {
            player.stop();
            statuslog.setText('Radio ' + name + ' gestoppt');
            return;
        }
        PlayStopButton.opacity = 0.4;
        statuslog.setText('Besorge Radio-Adresse für ' + name);
        player.release();
        require('controls/resolveplaylist')({
            playlist : model.stations[model.activestationindex].playlist,
            stream : model.stations[model.activestationindex].stream,
            onload : function(_url) {
                statuslog.setText('Radio-Adresse erkannt, starte jetzt Radio');
                PlayStopButton.opacity = 1;
                player.setUrl(_url);
                player.play();
            },
            onerror : function() {
                statuslog.setText('FEHLER: Radio-Adresse nicht erkannt.');
                PlayStopButton.opacity = 1;
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
            PlayStopButton.backgroundImage = '/images/stop.png';
            break;
        case Ti.Media.AudioPlayer.STATE_STARTING:
        case 4:
            // 3
            statuslog.setText('Radio ' + name + ' wird gestartet.');
            PlayStopButton.backgroundImage = '/images/stop.png';
            break;
        case 5:
            //5
            // statuslog.setText('Radio ' + name + ' ist verstummt');
            PlayStopButton.backgroundImage = '/images/play.png';
            break;
        case Ti.Media.AudioPlayer.STATE_STOPPING:
            //6
            statuslog.setText('Radio ist am Verstummen.');
            PlayStopButton.backgroundImage = '/images/play.png';
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
