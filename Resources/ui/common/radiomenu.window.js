const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Permissions = require('vendor/permissions');

const PATH = '/images/stationlogos3/%s.png';
const radioDrawer = require('ui/common/radio.drawer');

const STATIONCHOOSER = 0,
    PLAYER = 1;

module.exports = function(_tabgroup) {
	const radiostations = require('model/radiostations');

	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup

	});
	$.addEventListener('focus', function() {
		console.log("Window radio FOCUS");
	});
	$.addEventListener('open', function() {
		if ($.children && $.children.length)
			return;
		// making a new instance
		const radioTilesMenu = require('ui/common/radio.stationoverview').create(PATH);
		// getting View
		$.radioTilesMenuView = radioTilesMenu.getView();
		radioTilesMenu.updateRadioStationTiles();
		
		$.DrawerLayout = Ti.UI.Android.createDrawerLayout({
			leftView : radioDrawer(PATH, function() {
			  	radioTilesMenu.updateRadioStationTiles();
			}),
			centerView : $.radioTilesMenuView
		});
		$.add($.DrawerLayout);
		$.DrawerLayout.addEventListener('change',e => {
		});
		$.DrawerLayout.addEventListener('open', $.DrawerLayout.leftView.updateContent);

		Ti.App.addEventListener("app:toggleleft", function() {
			console.log("app:toggleleft");
			$.DrawerLayout.toggleLeft();
			console.log("app:toggleleft done");
		});

		$.radioTilesMenuView.addEventListener("click",(e) => {
			if (e.source.itemId) {
				Ti.Media.vibrate([50, 0]);
				const station = JSON.parse(e.source.itemId);
				const PlayerWindow = require('ui/common/radioplayer.window');
				PlayerWindow(_tabgroup, station, function() {
					radioTilesMenu.updateRadioStationTiles();
				}).open();
			}
		});

	});

	function onPermission(success) {
	}

	function onTabgroupOpen(e) {
		Permissions.requestPermissions('RECORD_AUDIO', onPermission);
	}

	// lifecycle stuff:
	/*
	 _tabgroup.activity.onRestart = function() {
	 visible = true;
	 if ($.DrawerLayout.currentPage == PLAYER)
	 $.visualizerView && playerView.add($.visualizerView);
	 };
	 _tabgroup.activity.onStop = function() {
	 visible = false;
	 if ($.DrawerLayout.currentPage == PLAYER)
	 $.visualizerView && playerView.remove($.visualizerView);
	 };
	 */
	return $;
};
// https://github.com/kgividen/TiCircularSliderBtnWidget
