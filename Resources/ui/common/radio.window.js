const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;
const VisualizerModule = require('ti.audiovisualizerview');
const Permissions = require('vendor/permissions');
const Animation = require("ti.scrollable.animation");
const PATH = '/images/stationlogos3/%s.png';
const StationListModule = require('ui/common/radio.stationlist');
const STATIONCHOOSER = 0, PLAYER = 1;

module.exports = function(_tabgroup) {
	const radiostations = require('model/radiostations');

	const Favs = require("controls/favs");
	const Streamer = require('vendor/audiostreamer.adapter');
	Streamer.init(_tabgroup, "applogo");
	var lastStatus = "STOPPED";
	var currentStation = null;
	var visible = true;

	var playerView = null;
	function stopPlayer() {
		Streamer.stop();

		$.ContainerView.scrollToView(STATIONCHOOSER);
		$.visualizerView && playerView.remove($.visualizerView);
		StationListModule.addTiles(PATH, $.stationList);

	}
	function playStation(station) {
		if (lastStatus == "BUFFERING") {
			return;
		}
		visible = true;
		if (lastStatus == "PLAYING")
			Streamer.stop();
		else if (lastStatus == "STOPPED") {
			$.visualizerView && playerView.add($.visualizerView);
			playerView.children[0].backgroundImage = PATH.replace('%s',
					station.logo);
			$.radiotextView.backgroundColor = station.color;
			$.radiotextView.children[0].text = station.title;
			Streamer.play({
				url : station.stream,
				id : station.logo,
				logo : PATH.replace('%s', station.logo),
				title : station.name,
				color : station.color || 'silver',
				lifecycleContainer : _tabgroup,
				icon : "applogo"
			}, function(e) {
				if (!visible)
					return;
				if (e.message && $.radiotextView)
					$.radiotextView.children[0].text = e.message;
				if (lastStatus != e.status) {
					lastStatus = e.status;
				}
			});
		}
		currentStation = JSON.parse(JSON.stringify(station));
	}

	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup

	});

	// https://github.com/prashantsaini1/scrollable_animation
	$.stationList = Ti.UI.createScrollView({
		scrollType : 'vertical',
		backgroundColor : '#ccffffff'
	});
	StationListModule.addTiles(PATH, $.stationList);
	playerView = Ti.UI.createView({
		backgroundColor : 'transparent'
	});
	playerView.add(Ti.UI.createView({
		width : SCREENWIDTH,
		height : SCREENWIDTH,
		top : 0,
	}));
	$.radiotextView = Ti.UI.createView({
		height : 40,
		bottom : 0,
	});
	$.radiotextView.add(Ti.UI.createLabel({
		color : 'white',
		font : {
			fontSize : 20,
			fontFamily : 'Rambla-Bold'
		},
		// text : station.name,
		width : Ti.UI.FILL,
		horizontalWrap : false,
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		left : 10,
		right : 50
	}));
	$.radiotextView.add(Ti.UI.createView({
		width : 40,
		opacity : 0,
		backgroundImage : '/images/burger.png',
		right : 0
	}));

	playerView.children[0].addEventListener('click', stopPlayer);
	$.ContainerView = Ti.UI.createScrollableView({
		clipViews : false,
		currentPageIndicatorColor : '#f44',
		pageIndicatorColor : '#a00',
		pagingControlOnTop : true,
		showPagingControl : false,
		scrollingEnabled : false,
		overlayEnabled : true,
		views : [ $.stationList, playerView ]
	});
	Animation.setAnimation($.ContainerView, Animation.CUBE_OUT);

	$.add($.ContainerView);

	$.stationList
			.addEventListener(
					"click",
					function(e) {
						Ti.Media.vibrate([ 50, 0 ]);
						visible=true;
						$.ContainerView.scrollToView(PLAYER);
						try {
							const station = JSON.parse(e.source.itemId);
							Permissions
									.requestPermissions(
											'READ_PHONE_STATE',
											function(success) {
												console
														.log("requestPermissions READ_PHONE_STATE after pla click");
												if (success)
													playStation(station);
											});
						} catch (E) {
							console.log(E);
						}

					});
	_tabgroup.addEventListener('open', onTabgroupOpen);
	function onPermission(success) {
		if (success) {
			$.visualizerView = VisualizerModule
					.createView({
						center : {
							y : SCREENWIDTH + 50
						},
						audioSessionId : 0,
						touchEnabled : false,
						linegraphRenderer : {
							strokeWidth : 2 * Ti.Platform.displayCaps.logicalDensityFactor
						}
					});

			playerView.add($.radiotextView);
		} else
			console.log("PERMISSION NOT GRANTED!!!");
	}

	function onTabgroupOpen(e) {
		Permissions.requestPermissions('RECORD_AUDIO', onPermission);
	}

	// lifecycle stuff:
	_tabgroup.activity.onRestart = function() {
		visible = true;
		if ($.ContainerView.currentPage == PLAYER)
			$.visualizerView && playerView.add($.visualizerView);
	};
	_tabgroup.activity.onStop = function() {
		visible = false;
		if ($.ContainerView.currentPage == PLAYER)
			$.visualizerView && playerView.remove($.visualizerView);
	};

	return $;
};
// https://github.com/kgividen/TiCircularSliderBtnWidget
