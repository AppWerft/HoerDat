const URL = 'http://www.fipradio.fr/sites/default/files/import_si/si_titre_antenne/FIP_player_current.json';
var abx = require('com.alcoapps.actionbarextras');
var Moment = require('vendor/moment');
var FlipModule = require('de.manumaticx.androidflip');

var screenwidth = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor,
    screenheight = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;

function getView() {
	return Ti.UI.createScrollView({
		scrollType : 'vertical',
		backgroundColor : 'black',
		layout : 'vertical'
	});
}

module.exports = function() {
	function getMeta() {
		var $ = Ti.Network.createHTTPClient({
			onload : function() {
				onLoadFn(JSON.parse(this.responseText));
			}
		});
		$.open('GET', URL);
		$.send();
	}

	var $ = Ti.UI.createWindow({
		fullscreen : true
	});
	$.cron = setInterval(getMeta, 2000);
	var keys = ['previous2', 'previous1', 'current', 'next1', 'next2'];
	$.add(Ti.UI.createView({
		top : 0.2,
		backgroundColor : '#555',
		height : 3
	}));
	$.children[0].add(Ti.UI.createView({
		backgroundColor : '#EE2887',
		width : 1
	}));
	$.add(FlipModule.createFlipView({
		top : 3,
		orientation : FlipModule.ORIENTATION_HORIZONTAL,
		overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
		views : ['current'].map(function(key) {
			return getView(key);
		}),
		currentPage : 2,
		height : Ti.UI.FILL
	}));
	$.addEventListener('focus', function() {
		$.children[1].peakNext(true);
	});
	var lastsong = {};
	var onLoadFn = function(payload) {
		abx.title = payload.current.emission.titre || 'fipRadio';
		abx.subtitle = 'bis: ' + Moment.unix(payload.current.emission.endTime).format('HH:mm') + ' Uhr';
		var song = payload.current.song;
		var duration = song.endTime - song.startTime;
		// seconds
		var done = ((new Date().getTime()) / 1000 - song.startTime) / duration * 100;
		$.children[0].children[0].setWidth(done + '%');
		if (lastsong.id == payload['current'].song.id)
			return;
		lastsong = payload['current'].song;
		['current'].forEach(function(key, i) {
			var view = $.children[1].views[i];
			if (!payload[key]) {
				view.removeAllChildren();
				return;
			}
			var song = payload[key].song;
			view.removeAllChildren();
			var scheduler = Ti.UI.createView({
				top : 0,
				width : Ti.UI.FILL,
				height : 65

			});
			//console.log(payload.current.song);
			var positions = {
				"previous2" : -2,
				"previous1" : -1,
				"current" : 0,
				"next1" : 1,
				"next2" : 2
			};
			keys.forEach(function(key) {
				if (payload[key]) {
					scheduler.add(Ti.UI.createImageView({
						center : {
							x : (positions[key] * 60 + screenwidth / 2)
						},
						width : (key == "current") ? 65 : 60,
						borderWidth : 0,
						borderColor : (key == "current") ? '#EE2887' : 'transparent',
						height : (key == "current") ? 65 : 60,
						image : payload[key].song.visuel.small
					}));
				} else
					console.log('Warning: no payload for ' + key);
			});

			view.add(scheduler);

			view.add(Ti.UI.createLabel({
				top : 15,
				left : 10,
				width : Ti.UI.FILL,
				height : 'auto',
				color : '#ddd',
				font : {
					fontFamily : 'Montserrat-Light',

					fontSize : 18
				},
				text : song.titre
			}));
			view.add(Ti.UI.createLabel({
				top : 0,
				left : 10,
				width : Ti.UI.FILL,
				height : 'auto',
				text : song.titreAlbum,
				color : '#aaa',
				font : {
					fontFamily : 'Montserrat-Bold',
					fontSize : 32
				},
			}));
			view.add(Ti.UI.createImageView({
				top : 5,
				width : Ti.UI.FILL,
				height : 'auto',
				image : song.visuel.medium
			}));
			var annee = (song.anneeEditionMusique) ? song.anneeEditionMusique + '@' : '';
			var label = (song.label) ? song.label : '';
			var interprete = (song.interpreteMorceau) ? song.interpreteMorceau + ', ' : '';

			view.add(Ti.UI.createLabel({
				top : 5,
				left : 10,
				textAlign : 'right',
				width : Ti.UI.FILL,
				height : 'auto',
				text : interprete + annee + label,
				color : '#EE2887',
				font : {
					fontSize : 12
				},
			}));

		});

	};
	getMeta(onLoadFn);
	$.addEventListener('close', function(_e) {
		$.cron && clearInterval($.cron);
	});
	$.addEventListener('open', function(_e) {
		abx.title = 'FIP';
		abx.backgroundColor = "#EE2887";
		abx.statusbarColor = "#EE2887";
		abx.subtitle = 'Vous écoutez fip';
		abx.titleFont = "Montserrat-Regular";
		abx.subtitleColor = "#ccc";
		var activity = $.getActivity();
		if (activity) {
			activity.onCreateOptionsMenu = function(e) {
				activity.actionBar.displayHomeAsUp = true;
				e.menu.clear();
			};
			activity.actionBar.homeButtonEnabled = true;
			activity.actionBar.onHomeIconItemSelected = function() {
				$.close();
			};
		}
	});

	return $;
};
