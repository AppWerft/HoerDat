module.exports = function() {
    var restored = false;
    var reStoreFunc = function() {
        if (!restored)
            setTimeout(function() {
                RadioWheel && RadioWheel.goToSegment(model.currentstation);
                ui.StatusLog.setText(model.currentstation);
                restored = true;
            }, 500);
        return;
    };
    var ui = Ti.UI.createWindow({
        backgroundColor : 'white'
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
    
    ui.add(ui.StatusLog);
    ui.addEventListener('focus', function() {
        reStoreFunc();

    });
    // ui.getActivity().onResume = reStoreFunc;
    // ui.getActivity().onRestart = reStoreFunc;
    ui.addEventListener('swipe', function(_e) {
        if (_e.direction == 'left' || _e.direction == 'right') {
            ui.PlayStopControl.backgroundImage = '/images/leer.png';
            ui.PlayStopControl.stopPlayer();
            ui.StatusLog.setText('Radio angehalten.');
            model.currentstation = RadioWheel.rotateStep(_e.direction);
            Ti.App.Properties.setInt('CURRENT_STATION_INDEX', model.currentstation);
            var name = model.radiostations[model.currentstation].logo;
            ui.StatusLog.setText('Könnte jetzt ' + name + ' zuschalten.');
            ui.PlayStopControl.backgroundImage = '/images/play.png';
        }
    });
    ui.PlayStopControl = new (require('controls/radio.control'))(model);
    ui.PlayStopControl.addEventListener('change', function(_e) {
        ui.StatusLog.setText(_e.message);
    });    
    ui.add(ui.PlayStopControl.createView());
    return ui;
};
