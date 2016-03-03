var AudioStreamer = require('vendor/audiostreamer.adapter');

const PLAY = '/images/play.png',
    LEER = '/images/leer.png',
    STOP = '/images/stop.png';
var onair = false;

exports.getView = function() {
	var options = arguments[0] || {};
	var $ = Ti.UI.createView({
		bottom : 10,
		width : 100,
		height : 100,
		zIndex : 913,
		backgroundImage : PLAY
	});
	$.spinner = Ti.UI.createActivityIndicator({
		style : Ti.UI.ActivityIndicatorStyle.BIG,
		transform : Ti.UI.create2DMatrix({
			scale : 1.1
		})
	});
	$.add($.spinner);
	var callbackFn = function(_payload) {
		switch(_payload.status) {
		case 'PLAYING':
			onair = true;

			if (_payload.message) {
				var message = _payload.message;
				if (options.messageView) {
					/*if (singleton.model.radiostations[singleton.model.currentstation].latin1) {
					message = encodeURI(_payload.message)//
					.replace(/%20/gm, ' ')//
					.replace(/%EF%BF%BD/gm, 'Ö')//
					.replace('Öchste', 'ächste')//
					.replace('fÖr','für')//
					.replace('Öume','äume')//
					.replace('esprÖch','espräch')//
					.replace('Önster', 'ünster');
					console.log(message);
					} else*/

					// if latin1 we convert:

					options.messageView.setText(message);
				} else
					Ti.UI.createNotification({duration:5000,message:message}).show(message);
			}
			$.backgroundImage = STOP;
			$.spinner.hide({
				animated : true
			});
			break;
		case 'STOPPED':
			onair = false;
			$.backgroundImage = PLAY;
			if (options.messageView) {
				options.messageView.setText('');
			}
			$.spinner.hide();
			break;
		case 'BUFFERING':
			break;
		}
	};
	$.addEventListener('click', function() {
		if (onair) {
			AudioStreamer.stop();
			onair = false;
			return;
		}
		$.backgroundImage = LEER;
		$.hide();
		var currentStation = Ti.App.Properties.getObject('CURRENT_STATION', require('model/radiostations')[0]);
		require('controls/resolveplaylist')({
			playlist : currentStation.playlist,
			stream : currentStation.stream,
			onload : function(_icyurl) {
				console.log(_icyurl);
				Ti.App.Properties.setString('CURRENT_STATION_STREAM', _icyurl);
				$.show({
					animated : true
				});
				AudioStreamer.play(_icyurl, callbackFn);
				$.spinner.show();
			},
			onerror : function() {
				//ui.StatusLog.setText('FEHLER: Radio-Adresse nicht erkannt.');
				$.opacity = 1;
			}
		});
	});
	return $;
};

