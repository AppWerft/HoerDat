const URL = 'http://www.fipradio.fr/sites/default/files/import_si/si_titre_antenne/FIP_player_current.json';
var abx = require('com.alcoapps.actionbarextras');
var Moment = require('vendor/moment');
function getMeta(_cb) {
	var $ = Ti.Network.createHTTPClient({
		onload : function() {
			_cb(JSON.parse(this.responseText));
		}
	});
	$.open('GET', URL);
	$.send();
}

function getView() {
	return Ti.UI.createView({
		backgroundColor : 'white',
		layout : 'vertical'
	});
}

module.exports = function() {
	var $ = Ti.UI.createWindow();
	var keys = ['previous2', 'previous1', 'current', 'next1', 'next2'];
	$.add(Ti.UI.createScrollableView({
		currentPage : 2,
		views : keys.map(function(key) {
			return getView(key);
		}),
	}));
	var lastsong = '';
	var onLoadFn = function(payload) {
		var nextemission = Moment.unix(payload.next1.song.startTime);
		//var duration = (payload.next1.song.endTime-payload.next1.song.startTime)/1000;
		var timetoupdate = nextemission.diff(Moment()) + 1000;
		setTimeout(function() {
			getMeta(onLoadFn);
		}, timetoupdate);
		keys.forEach(function(key, i) {
			var song = payload[key].song;
			if (i == 2) {
				if (lastsong == song)
					return;
				lastsong = song;
			}
			var view = $.children[0].views[i];
			view.removeAllChildren();
			view.add(Ti.UI.createImageView({
				top : 0,
				width : Ti.UI.FILL,
				height : 'auto',
				image : payload[key].song.visuel.medium
			}));

			view.add(Ti.UI.createLabel({
				top : 5,
				left : 10,
				width : Ti.UI.FILL,
				height : 'auto',
				color : '#333',
				font : {
					fontWeight : 'bold',
					fontSize : 27
				},
				text : song.titre
			}));
			view.add(Ti.UI.createLabel({
				top : 0,
				left : 10,
				width : Ti.UI.FILL,
				height : 'auto',
				text : song.titreAlbum,
				color : '#333',
				font : {
					fontWeight : 'bold',
					fontSize : 22
				},
			}));
		});

	};
	getMeta(onLoadFn);
	$.addEventListener('open', function(_e) {
		abx.title = 'FIP';
		abx.backgroundColor = "#EE2887";
		abx.statusbarColor = "#EE2887";
		abx.subtitle = 'Vous écoutez fip';
		abx.titleFont = "Rambla-Bold";
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
