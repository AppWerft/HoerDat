const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;
const Visualizer = require('ti.audiovisualizerview');
const Permissions = require('vendor/permissions');
const Animation = require("ti.scrollable.animation");
const PATH = '/images/stationlogos3/%s.png';
const StationListModule = require('ui/common/radio.stationlist');

module.exports = function(_tabgroup) {
	const radiostations = require('model/radiostations');

	const Favs = require("controls/favs");
	const Streamer = require('vendor/audiostreamer.adapter');
	Streamer.init(_tabgroup, "applogo");
	var lastStatus = "STOPPED";
	var currentStation = null;
	
	var playerView = null;
	function stopPlayer() {
		Streamer.stop();

		$.ContainerView.scrollToView(0);
		StationListModule.addTiles(PATH, $.stationList);
		
	}
	function playStation(station) {
		if (lastStatus == "BUFFERING") {
			return;
		}
		console.log("lastStatus: " + lastStatus);
		if (lastStatus == "PLAYING")
			Streamer.stop();
		else if (lastStatus == "STOPPED") {
			playerView.children[0].backgroundImage = PATH.replace('%s',
					station.logo);
			playerView.children[2].backgroundColor = station.color;
			playerView.children[2].children[0].text = station.title;
			
			Streamer.play({
				url : station.stream,
				id : station.logo,
				logo : PATH.replace('%s', station.logo),
				title : station.name,
				color : station.color || 'silver',
				lifecycleContainer : _tabgroup,
				icon : "applogo"
			}, function(e) {
				if (e.message && radiotextView)
					radiotextView.children[0].setText(e.message);
				if (lastStatus != e.status) {
					switch (e.status) {
					case "PLAYING":
						break;
					}
					lastStatus = e.status;
				}
			});
		}
		currentStation = JSON.parse(JSON.stringify(station));
	}
   
	//// START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup

	});
	/* display of tuning wheel */
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
		//backgroundImage : PATH.replace('%s', station.logo)
	}));
	const radiotextView = Ti.UI.createView({
		height : 40,
		bottom : 0,
		//backgroundColor : station.color || 'black',
	});
	radiotextView.add(Ti.UI.createLabel({
		color : 'white',
		font : {
			fontSize : 20,
			fontFamily : 'Rambla-Bold'
		},
		//text : station.name,
		width : Ti.UI.FILL,
		horizontalWrap : false,
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		left : 10,
		right : 10
	}));

	const visualizerView = Visualizer.createView({
		height : 220,
		bottom : 0,
		zIndex:99,
		audioSessionId : 0,
		touchEnabled : false,
		linegraphRenderer : {
			strokeWidth : 2 * Ti.Platform.displayCaps.logicalDensityFactor
		}
	});

	playerView.add(visualizerView);
	playerView.add(radiotextView);
	playerView.addEventListener('click', stopPlayer);

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

	$.stationList.addEventListener("click", function(e) {
		$.ContainerView.scrollToView(playerView);
		try {
			const station = JSON.parse(e.source.itemId);
			playStation(station);
			Ti.UI.createNotification(
					{
						message : "Bisherige Gesamthörzeit: "
								+ Math.round(station.total / 60) + ' min.'
					}).show();
		} catch (E) {
			console.log(E);
		}

	});
	Ti.App.addEventListener('stopRadio', function() {

	});
	return $;
};
// https://github.com/kgividen/TiCircularSliderBtnWidget
