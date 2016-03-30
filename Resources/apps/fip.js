const URL = 'http://www.fipradio.fr/sites/default/files/import_si/si_titre_antenne/FIP_player_current.json';
var abx = require('com.alcoapps.actionbarextras');
var Moment = require('vendor/moment');
var screenwidth = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor,
    screenheight = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;

var positions = {
	"previous2" : -2,
	"previous1" : -1,
	"current" : 0,
	"next1" : 1,
	"next2" : 2
};

var ytlist = [];
var interprete;

var $ = function() {
	function getCurrentDataFromFIP() {
		var $ = Ti.Network.createHTTPClient({
			onload : function() {
				try {
					var payload = JSON.parse(this.responseText);
				} catch(E) {
					console.log(E);
				}
				payload && updateViews(payload);
			}
		});
		$.open('GET', URL);
		$.send();
	}
	var $ = Ti.UI.createWindow({
		fullscreen : true,
	});
	$.container = Ti.UI.createScrollView({
		layout : 'vertical',
		scrollType : 'vertical'
	});
	$.add($.container);
	var keys = ['previous2', 'previous1', 'current', 'next1', 'next2'];
	$.emissionprogressView = Ti.UI.createView({
		top : 0,
		backgroundColor : '#000',
		height : 3
	});
	$.emissionprogressView.add(Ti.UI.createView({
		backgroundColor : '#EE2887',
		width : 1,
		left : 0,
	}));
	// adding progress view
	$.songprogressView = Ti.UI.createView({
		top : 0,
		backgroundColor : '#000',
		height : 3
	});
	$.songprogressView.add(Ti.UI.createView({
		backgroundColor : '#EE2887',
		width : 1,
		left : 0,
	}));
	// history:
	$.historyView = Ti.UI.createView({
		top : 0,
		height : 70
	});
	// title
	$.titleView = Ti.UI.createLabel({
		top : 15,
		left : 10,
		width : Ti.UI.FILL,
		height : 'auto',
		color : '#ddd',
		font : {
			fontFamily : 'Montserrat-Light',
			fontSize : 18
		},
	});
	$.albumView = Ti.UI.createLabel({
		top : 0,
		left : 10,
		width : Ti.UI.FILL,
		height : 'auto',
		color : '#aaa',
		font : {
			fontFamily : 'Montserrat-Bold',
			fontSize : 32
		},
	});
	$.coverView = Ti.UI.createImageView({
		top : 5,
		width : Ti.UI.FILL,
		height : 'auto',
		defaultImage : '/images/fiplogo.png'
	});
	$.sourceView = Ti.UI.createLabel({
		top : 5,
		left : 10,
		textAlign : 'right',
		width : Ti.UI.FILL,
		height : 'auto',
		color : '#EE2887',
		font : {
			fontSize : 12
		}
	});
	$.container.add($.emissionprogressView);
	$.container.add($.songprogressView);
	$.container.add($.historyView);
	$.container.add($.titleView);
	$.container.add($.albumView);
	$.container.add($.coverView);
	$.container.add($.sourceView);
	var lastsong = {};
	var updateViews = function(payload) {
		abx.title = payload.current.emission.titre || 'fipRadio';
		abx.subtitle = Moment.unix(payload.current.emission.startTime).format('HH:mm') + ' – ' + Moment.unix(payload.current.emission.endTime).format('HH:mm') + ' Uhr';
		var emission = payload.current.emission;
		if (!emission)
			return;
		var emissionduration = emission.endTime - emission.startTime;
		// seconds
		var emissiondone = ((new Date().getTime()) / 1000 - emission.startTime) / emissionduration * 100;
		$.emissionprogressView.children[0].setWidth(emissiondone + '%');
		var song = payload.current.song;
		if (!song) {
			$.titleView.setText('Es liegt derweil kein Songliste vor');
			$.songprogressView.setHeight(0);
			$.historyView.setHeight(0);
			interprete = '';
			return;
		}
		$.songprogressView.setHeight(3);
		$.historyView.setHeight(70);
		var songduration = song.endTime - song.startTime;
		// seconds
		var songdone = ((new Date().getTime()) / 1000 - song.startTime) / songduration * 100;
		$.songprogressView.children[0].setWidth(songdone + '%');
		if (lastsong.id == payload['current'].song.id)
			return;
		lastsong = payload['current'].song;
		$.historyView.removeAllChildren();
		if ($.yticon)
			$.yticon.setVisible(false);
		Object.getOwnPropertyNames(positions).forEach(function(key) {
			if (payload[key]) {
				$.historyView.add(Ti.UI.createImageView({
					center : {
						x : (positions[key] * 75 + screenwidth / 2)
					},
					width : (key == "current") ? 70 : 70,
					borderWidth : 0,
					borderColor : (key == "current") ? '#EE2887' : 'transparent',
					height : (key == "current") ? 70 : 70,
					image : payload[key].song.visuel.small
				}));
			} else
				console.log('Warning: no payload for ' + key);
		});
		var song = payload['current'].song;
		$.titleView.setText(song.titre);
		$.albumView.setText(song.titreAlbum);
		$.coverView.setImage(song.visuel.medium);
		var annee = (song.anneeEditionMusique) ? song.anneeEditionMusique + '@' : '';
		var label = (song.label) ? song.label : '';
		interprete = (song.interpreteMorceau) ? song.interpreteMorceau + ', ' : '';
		$.sourceView.setText(interprete + annee + label);
		/* preparing of youtube */
		require('vendor/tiyoutube').searchVideos(interprete, function(_payload) {
			ytlist = _payload;
			if ($.yticon)
				$.yticon.visible = true;

		});

		payload = null;
	};
	getCurrentDataFromFIP();
	// init
	$.addEventListener('blur', function(_e) {
		console.log('FIP blurred cron=' + $.cron);
		$.cron && clearInterval($.cron);
	});
	$.addEventListener('focus', function(_e) {
		console.log('FIP focused');
		$.cron = setInterval(getCurrentDataFromFIP, 5000);
	});
	$.addEventListener('close', function(_e) {
		$ = null;
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
				$.yticon = e.menu.add({
					title : 'Youtube',
					visible : false,
					icon : Ti.App.Android.R.drawable.ic_action_youtube,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				});
				$.yticon.addEventListener("click", function(_e) {
					require('apps/fipyt')({
						ytlist : ytlist,
						interprete : interprete
					}).open();
				});
			};
			activity.actionBar.onHomeIconItemSelected = function() {
				$.close();
			};
		}
		activity.invalidateOptionsMenu();
	});
	return $;
};

module.exports = $;
