var AudioStreamer = require('vendor/audiostreamer.adapter');
var radiostationsList = require('model/radiostations');

var Crouton = require('de.manumaticx.crouton');
var croutonView;
const PLAY = '/images/play.png',
    LEER = '/images/leer.png',
    STOP = '/images/stop.png';
var onair = false;
var currentStation;
var lastmessage = '';

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
			scale : 1.2
		})
	});
	$.add($.spinner);
	var callbackFn = function(_payload) {
		switch(_payload.status) {
		case 'PLAYING':
			onair = true;
			if (_payload.message) {
				/*if (currentStation.latin1) {

				 var message = encodeURI(_payload.message)//
				 .replace(/%20/gm, ' ')//
				 .replace(/%EF%BF%BD/gm, 'Ö')//
				 .replace('Öchste', 'ächste')//
				 .replace('fÖr', 'für')//
				 .replace('Öume', 'äume')//
				 .replace('esprÖch', 'espräch')//
				 .replace('franzÖs', 'französ')//
				 .replace('Öln', 'öln')//
				 .replace('Ören', 'ören')//
				 .replace('Önster', 'ünster');

				 } else
				 var message = _payload.message;*/
				var message = _payload.message.replace('�', ' ');
				if (onair && message != lastmessage && !currentStation.module) {
					croutonView = Crouton.show({
						text : message,
						color : '#aa326598'
					});
					if (onair)
						lastmessage = message;
					else
						lastmessage = '';
				}
				/*				Ti.UI.createNotification({
				 center: {y:'20%'},
				 duration : 5000,
				 message : message
				 }).show(message);*/
			}
			$.backgroundImage = STOP;
			$.spinner.hide({
				animated : true
			});
			break;
		case 'STOPPED':
			onair = false;
			croutonView && Crouton.hide(croutonView);
			$.backgroundImage = PLAY;
			if (options.messageView) {
				options.messageView.setText('');
			}
			$.spinner.hide();
			break;
		case 'TIMEOUT':
			console.log('AAS: audioStreamer TIMEOUT');
			croutonView && Crouton.hide(croutonView);
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
		currentStation = radiostationsList[Ti.App.Properties.getInt('CURRENT_STATION_INDEX')];
		if (currentStation.module != undefined) {
			var win = require(currentStation.module)();
			win.open();
			win.addEventListener('close', function() {
				AudioStreamer.stop();
				onair = false;
			});
		}
		$.backgroundImage = LEER;
		options.messageView && options.messageView.setText(currentStation.name);
		if ( typeof $.onSelect == 'function') {
			$.onSelect();
		}
		$.hide();
		require('controls/resolveplaylist')({
			playlist : currentStation.playlist,
			stream : currentStation.stream,
			onload : function(_icyurl) {
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

