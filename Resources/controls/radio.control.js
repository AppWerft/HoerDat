var AudioStreamer = require('vendor/audiostreamer.adapter');

//

function LOG() {
}

function convertToHex(str) {
	var hex = '';
	for (var i = 0; i < str.length; i++) {
		hex += '' + str.charCodeAt(i).toString(16);
	}
	return hex;
}

const PLAY = '/images/play.png',
    LEER = '/images/leer.png',
    STOP = '/images/stop.png';

var singleton = {
	cron : null,
	messageView : null,
	tick : 0,
	onair : false,
	messageView : require('ui/marquee.widget')(),
	buttonView : null,
	model : null
};

var $ = function(model) {
	singleton.model = model, this.eventhandlers = {};
	singleton.onair = false;
	singleton.buttonView = this._buttonView = Ti.UI.createView({
		bottom : 10,
		width : 100,
		height : 100,
		zIndex : 913,
		backgroundImage : PLAY
	});
	this._buttonView.spinner = require('vendor/circularprogress')({
		percent : 0,
		size : 32,
		margin : 0,
		touchEnabled : false,
		zIndex : 91,
		progressColor : '#427aa7',
		topper : {
			color : 'transparent',
			size : 32
		},
		font : {
			visible : false
		}
	});
	this._buttonView.add(this._buttonView.spinner);
	var that = this;
	this._buttonView.addEventListener('click', function() {
		if (singleton.onair) {
			AudioStreamer.stop();
			singleton.onair = false;

			return;
		}
		that._buttonView.backgroundImage = LEER;
		clearInterval(singleton.cron);
		singleton.tick = 0;
		var name = singleton.model.radiostations[singleton.model.currentstation].logo;
		that._buttonView.opacity = 0.2;
		require('controls/resolveplaylist')({
			playlist : singleton.model.radiostations[singleton.model.currentstation].playlist,
			stream : singleton.model.radiostations[singleton.model.currentstation].stream,
			onload : function(_url) {
				singleton.model.radiostations[singleton.model.currentstation].stream = _url;
				that._buttonView.opacity = 1;
				AudioStreamer.play(_url, that.callbackFn);

				that._buttonView.spinner.show();
				singleton.tick = 0;
				singleton.cron = setInterval(function() {
					singleton.tick++;
					if (singleton.tick == 100) {
						clearInterval(singleton.cron);
						singleton.cron = null;
						that._buttonView.backgroundImage = PLAY;
						that._buttonView.spinner.hide({
							animated : true
						});
					}
					that._buttonView.spinner.setValue(that.tick / 100);
				}, 100);
			},
			onerror : function() {
				//ui.StatusLog.setText('FEHLER: Radio-Adresse nicht erkannt.');
				that._buttonView.opacity = 1;
			}
		});
	});
	return this;
};

$.prototype = {
	callbackFn : function(_payload) {
		var that = this;
		switch(_payload.status) {
		case 'PLAYING':
			singleton.onair = true;
			if (singleton.cron) {
				console.log('cron wil killed by playing');
				clearInterval(singleton.cron);
				singleton.cron = null;
			}
			if (_payload.message && singleton.messageView) {
				if (singleton.model.radiostations[singleton.model.currentstation].latin1) {
					message = encodeURI(_payload.message)//
					.replace(/%20/gm, ' ')//
					.replace(/%EF%BF%BD/gm, 'Ö')//
					.replace('Öchste', 'ächste')//
					.replace('fÖr','für')//
					.replace('Öume','äume')//
					.replace('esprÖch','espräch')//
					.replace('Önster', 'ünster');
					console.log(message);
				} else
					var message = _payload.message;
				// if latin1 we convert:

				singleton.messageView.setText(message);
			}
			singleton.buttonView.backgroundImage = STOP;
			singleton.buttonView.spinner.hide({
				animated : true
			});
			break;
		case 'STOPPED':
			singleton.onair = false;
			singleton.messageView.setText('');
			singleton.buttonView.backgroundImage = PLAY;
			singleton.buttonView.spinner.hide();
			break;
		case 'BUFFERING':
			break;
		}
	},
	createViews : function() {
		return [this._buttonView, singleton.messageView];
	},
	stopPlayer : function() {
		AudioStreamer.stop();
	},
	hide : function() {
		var that = this;
		this._buttonView.animate({
			duration : 100,
			opacity : 0,
			transform : Ti.UI.create2DMatrix({
				scale : 0.3
			})
		}, function() {
			that._buttonView.backgroundImage = PLAY;
		});
	},
	show : function() {
		var that = this;
		this._buttonView.animate({
			duration : 50,
			opacity : 1,
			transform : Ti.UI.create2DMatrix({
				scale : 1.2
			})
		}, function() {
			that._buttonView.animate({
				duration : 50,
				transform : Ti.UI.create2DMatrix({
					scale : 1

				})
			});
		});
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

module.exports = $;
