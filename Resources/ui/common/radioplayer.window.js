const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0,
    STATUS_PROGRESS = 1,
    STATUS_SAVED = 2;
const TEMPLATES = ['pool_online'];
const ABX = require('com.alcoapps.actionbarextras');
const PATH = '/images/stationlogos3/%s.png';

module.exports = function(_tabgroup, station, renderParentSections) {
	const Streamer = require('vendor/audiostreamer.adapter');
	Streamer.init(_tabgroup, "applogo");
	var lastStatus = "STOPPED";
	var currentStation = null;
	var visible = true;

	var PlayerView = null;
	function stopPlayer() {
		Streamer.stop();
		//StationListModule.addTiles(PATH, $.stationList);
	}

	function playStation(station) {
		if (lastStatus == "BUFFERING") {
			return;
		}
		visible = true;
		if (lastStatus == "PLAYING")
			Streamer.stop();
		else if (lastStatus == "STOPPED") {
			Streamer.play({
				url : station.stream,
				station : station.station,
				logo : PATH.replace('%s', station.station),
				title : station.name,
				color : station.color || 'silver',
				lifecycleContainer : _tabgroup,
				icon : "applogo"
			}, function(e) {
				e.message && PlayerView && PlayerView.setText(e.message);
				if (lastStatus != e.status) {
					lastStatus = e.status;
				}
			});
		}
		currentStation = station;
	}

	function onPermission(success) {
		if (success) {
			PlayerView && PlayerView.addVisualization();
			playStation(station);

		}

	}

	var started = false;

	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		//exitOnClose : !renderParentSections

	});
	$.addEventListener('close', function() {
		stopPlayer();
		$.removeAllChildren();
		renderParentSections && renderParentSections();
		$ = null;
	});
	$.addEventListener('open', _e => {
		ABX.title = 'Live-Radio';
		ABX.backgroundColor = "#225588";
		ABX.subtitle = station.name;
		ABX.titleFont = "Rambla-Bold";
		ABX.subtitleColor = "#fff";
		const activity = $.activity;
		if (activity != undefined && activity.actionBar != undefined) {
			activity.onCreateOptionsMenu = _menu => {
				activity.actionBar.displayHomeAsUp = true;
				_menu.menu.add({
					title : 'Record',
					icon : Ti.App.Android.R.drawable.ic_action_record,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
					}).addEventListener("click", () => {
						alert("Hier startet bald die Möglichkeit " + station.name + " live mitzuschneiden");
					});
				activity.invalidateOptionsMenu();

				activity.actionBar.onHomeIconItemSelected = () => {
					$.close({
						activityEnterAnimation : Ti.Android.R.slide_in_left,
						activityExitAnimation : Ti.Android.R.slide_out_right
					});
				};
			};
		} else
			console.log("win has no activity");
		PlayerView = require('ui/common/radioplayer.widget').createView(station);
		PlayerView && $.add(PlayerView.getView());
		Permissions.requestPermissions(['READ_PHONE_STATE', 'RECORD_AUDIO'], onPermission);
	});

	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
