var player = Ti.Media.createAudioPlayer({
    allowBackground : true,
    volume : 1
});

var Module = function(model) {
    this.model = model;
    this.eventhandlers = {};

    return this;
};
Module.prototype = {
    createView : function() {
        this._view = Ti.UI.createView({
            bottom : 40,
            width : 100,
            height : 100,
            backgroundImage : '/images/play.png'
        });
        var that = this;
        this._view.addEventListener('click', function() {
            that._view.backgroundImage = '/images/leer.png';
            var name = that.model.radiostations[that.model.currentstation].logo;
            if (player.isPlaying()) {
                player.stop();
                that.fireEvent('change', {
                    message : 'Radio ' + name + ' gestoppt'
                });
                return;
            }
            that._view.opacity = 0.4;
            that.fireEvent('change', {
                message : 'Besorge Radio-Adresse für ' + name
            });
            player.release();
            require('controls/resolveplaylist')({
                playlist : that.model.radiostations[that.model.currentstation].playlist,
                stream : that.model.radiostations[that.model.currentstation].stream,
                onload : function(_url) {
                    that._view.opacity = 1;
                    player.setUrl(_url);
                    player.play();
                    that.fireEvent('change', {
                        message : 'Radioadresse gefunden'
                    });
                },
                onerror : function() {
                    //ui.StatusLog.setText('FEHLER: Radio-Adresse nicht erkannt.');
                    that._view.opacity = 1;
                }
            });
        });
        player.addEventListener('change', function(_e) {
            var name = that.model.radiostations[that.model.currentstation].name || that.model.radiostations[that.model.currentstation].logo;
            switch (_e.state) {
            case Ti.Media.AudioPlayer.STATE_BUFFERING:
                //1
                // ui.StatusLog.setText('Daten werden gebuffert.');
                break;
            case Ti.Media.AudioPlayer.STATE_INITIALIZED:
                // ui.StatusLog.setText('Initialisierung.');
                break;
            case Ti.Media.AudioPlayer.STATE_PAUSED:
                //ui.StatusLog.setText('Radio pausiert');
                break;
            case Ti.Media.AudioPlayer.STATE_PLAYING:
            case 3:
                //3
                that.fireEvent('change', {
                message :'Radio spielt ' + name + ' .'});
                that._view.backgroundImage = '/images/stop.png';
                break;
            case Ti.Media.AudioPlayer.STATE_STARTING:
            case 4:
                //ui.StatusLog.setText('Radio ' + name + ' wird gestartet.');
                //ui.PlayStopButton.backgroundImage = '/images/stop.png';
                break;
            case 5:
                //ui.PlayStopButton.backgroundImage = '/images/play.png';
                break;
            case Ti.Media.AudioPlayer.STATE_STOPPING:
                //ui.StatusLog.setText('Radio ist am Verstummen.');
                //ui.PlayStopButton.backgroundImage = '/images/play.png';
                break;

            }
        });

        return this._view;
    },
    stopPlayer : function() {
        player.stop();
        player.release();
    },

    fireEvent : function(_event, _payload) {
        if (this.eventhandlers[_event]) {
            for (var i = 0; i < this.eventhandlers[_event].length; i++) {
                this.eventhandlers[_event][i].call(this, _payload);
            }
        }
    },
    addEventListener : function(_event, _callback) {
        if (!this.eventhandlers[_event])
            this.eventhandlers[_event] = [];
        this.eventhandlers[_event].push(_callback);
    },
    removeEventListener : function(_event, _callback) {
        if (!this.eventhandlers[_event])
            return;
        var newArray = this.eventhandlers[_event].filter(function(element) {
            return element != _callback;
        });
        this.eventhandlers[_event] = newArray;
    }
};

module.exports = Module;
