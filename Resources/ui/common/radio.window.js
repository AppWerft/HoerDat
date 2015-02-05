module.exports = function() {
    var reStoreFunc = function() {
        setTimeout(function() {
            RadioWheel && RadioWheel.goToSegment(model.currentstation);
            ui.StatusLog.setText(model.currentstation);
        }, 500);
        return;
    };
    var ui = Ti.UI.createWindow({
        backgroundColor : 'white'
    });
    var player = Ti.Media.createAudioPlayer({
        allowBackground : true,
        volume : 1
    });
    var model = {
        radiostations : require('model/radiostations'),
        currentstation : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0),
        φ : 0
    };

    var segment = 360 / model.radiostations.length;
    ui.StatusLog = Ti.UI.createLabel({
        bottom : 0,
        height : 20,
        backgroundColor : 'black',
        width : Ti.UI.FILL,
        zIndex : 9999,
        color : 'silver',
        textAlign : 'center',
        text : ''
    });
    var container = Ti.UI.createView({
        bottom : '20%'
    });
    ui.add(container);
    ui.stationviews = [];
    var images = [];
    for (var i = 0; i < model.radiostations.length; i++) {
        images[i] = '/images/' + model.radiostations[i].logo.toLowerCase() + '.png';
    }
    var RadioWheel = new (require('ui/common/radiowheel.widget'))();
    container.add(RadioWheel.createView({
        images : images,
        width : 200,
        anchorPoint : {
            x : 0.5,
            y : 3.2
        }
    }));
    model.φ = model.currentstation * segment;
    ui.PlayStopButton = Ti.UI.createView({
        bottom : 40,
        width : 100,
        height : 100,
        backgroundImage : '/images/play.png'
    });
    ui.add(ui.PlayStopButton);
    ui.add(ui.StatusLog);
    // ui.getActivity().onResume = reStoreFunc;
    // ui.getActivity().onRestart = reStoreFunc;
    ui.addEventListener('swipe', function(_e) {
        if (_e.direction == 'left' || _e.direction == 'right') {
            ui.PlayStopButton.backgroundImage = '/images/leer.png';
            player.stop();
            player.release();
            ui.StatusLog.setText('Radio angehalten.');
            model.currentstation = RadioWheel.rotateStep(_e.direction);
            Ti.App.Properties.setInt('CURRENT_STATION_INDEX', model.currentstation);
            var name = model.radiostations[model.currentstation].logo;
            ui.StatusLog.setText('Könnte jetzt ' + name + ' zuschalten.');
            ui.PlayStopButton.backgroundImage = '/images/play.png';
        }
    });
    ui.PlayStopButton.addEventListener('click', function() {
        ui.PlayStopButton.backgroundImage = '/images/leer.png';
        var name = model.radiostations[model.currentstation].logo;
        if (player.isPlaying()) {
            player.stop();
            ui.StatusLog.setText('Radio ' + name + ' gestoppt');
            return;
        }
        ui.PlayStopButton.opacity = 0.4;
        ui.StatusLog.setText('Besorge Radio-Adresse für ' + name);
        player.release();
        require('controls/resolveplaylist')({
            playlist : model.radiostations[model.currentstation].playlist,
            stream : model.radiostations[model.currentstation].stream,
            onload : function(_url) {
                ui.StatusLog.setText('Radio-Adresse erkannt, starte jetzt Radio');
                ui.PlayStopButton.opacity = 1;
                player.setUrl(_url);
                player.play();
            },
            onerror : function() {
                ui.StatusLog.setText('FEHLER: Radio-Adresse nicht erkannt.');
                ui.PlayStopButton.opacity = 1;
            }
        });
    });
    player.addEventListener('change', function(_e) {
        var name = model.radiostations[model.currentstation].name || model.radiostations[model.currentstation].logo;
        switch (_e.state) {
        case Ti.Media.AudioPlayer.STATE_BUFFERING:
            //1
            ui.StatusLog.setText('Daten werden gebuffert.');
            break;
        case Ti.Media.AudioPlayer.STATE_INITIALIZED:
            ui.StatusLog.setText('Initialisierung.');
            break;
        case Ti.Media.AudioPlayer.STATE_PAUSED:
            ui.StatusLog.setText('Radio pausiert');
            break;
        case Ti.Media.AudioPlayer.STATE_PLAYING:
        case 3:
            //3
            ui.StatusLog.setText('Radio spielt ' + name + ' .');
            ui.PlayStopButton.backgroundImage = '/images/stop.png';
            break;
        case Ti.Media.AudioPlayer.STATE_STARTING:
        case 4:
            ui.StatusLog.setText('Radio ' + name + ' wird gestartet.');
            ui.PlayStopButton.backgroundImage = '/images/stop.png';
            break;
        case 5:
            ui.PlayStopButton.backgroundImage = '/images/play.png';
            break;
        case Ti.Media.AudioPlayer.STATE_STOPPING:
            ui.StatusLog.setText('Radio ist am Verstummen.');
            ui.PlayStopButton.backgroundImage = '/images/play.png';
            break;

        }
    });

    return ui;
};
