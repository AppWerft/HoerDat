const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Visualizer = require('ti.audiovisualizerview');
const Permissions = require('vendor/permissions');
const ScrollableView = require('ru.netris.mobile.scrollableview');

function createRow(station) {
	const row = Ti.UI.createTableViewRow({
		height : 45,
		itemId : JSON.stringify(station)
	});
	row.add(Ti.UI.createLabel({
		left : 70,
		color : 'gray',
		textAlign : "left",
		width : Ti.UI.FILL,
		text : station.name,
		font : {
			fontWeight : 'bold',
			fontSize : 18,
			fontFamily : "Rambla"
		},
		touchEnabled : false
	}));

	row.add(Ti.UI.createImageView({
		left : 2.5,
		defaultImage : '/images/defaultimage.png',
		top : 2.5,
		width : 40,
		height : 40,
		image : "/images/mini/" + station.logo + ".png",
		touchEnabled : false
	}));
	return row;
};

module.exports = function(_tabgroup) {
	const radiostations = require('model/radiostations');
	const Animation = require("ti.scrollable.animation");
	const Favs = require("controls/favs");
	const Streamer = require('vendor/audiostreamer.adapter');
	Streamer.init(_tabgroup, "applogo");
	var lastStatus = "STOPPED";
	var currentStation = null;

	function getFavViews() {
		const getView = function(station) {
			const view = Ti.UI.createView({
				itemId : JSON.stringify(station),
				width : 	'100%',
				type : "TiUIView",
				bubbleParent : true
			});
			view.add(Ti.UI.createImageView({
				touchEnabled : false,
				type : "TiUIImageView",
				image : '/images/' + station.logo + '.png',
				width : Ti.UI.FILL,
				opacity : 0.9,
				height : 'auto'
			}));
			view.addEventListener("click", function(e) {
				console.log("CLICKonView");
				try {
					const station = JSON.parse(e.source.itemId);
					toggleStation(station);
				} catch(E) {
					console.log(E);
				}
			});
			return view;
		};
		return Favs.getAll().map(getView);
	}

	function toggleStation(station) {
		Permissions.requestPermissions(['RECORD_AUDIO', 'READ_PHONE_STATE'], function(success) {
			if (!success)
				return;
			if (lastStatus == "BUFFERING") {
				return;
			}
			console.log("toggleStation");
			if (station != currentStation) {
				Favs.add(station);
				$.favContainerView.setViews(getFavViews());
			}
			if ($.favContainerView.currentPage != 0)
				$.favContainerView.scrollToView(0);
			console.log("lastStatus: " + lastStatus);
			if (lastStatus == "PLAYING")
				Streamer.stop();
			else if (lastStatus == "STOPPED") {
				$.stationList.animate({
					opacity : 0

				});
				Streamer.play({
					url : station.stream,
					logo : '/images/' + station.logo + '.png',
					title : station.name,
					color : station.color || 'silver',
					lifecycleContainer : _tabgroup,
					icon : "applogo"
				}, function(e) {
					if (e.message && $.radiotextView)
						$.radiotextView.children[0].setText(e.message);
					if (lastStatus != e.status) {
						switch (e.status) {
						case "STOPPED":
							$.favContainerView.scrollingEnabled = true;
							$.stationList.animate({
								opacity : 1
							});
							if ($.visualizerView) {
								$.remove($.visualizerView);
								$.visualizerView = null;
							}
							if ($.radiotextView) {
								$.remove($.radiotextView);
								$.radiotextView = null;
							}
							break;
						case "PLAYING":
							$.favContainerView.scrollingEnabled = false;

							if (!$.visualizerView) {

								$.visualizerView = Visualizer.createView({
									height : 180,
									bottom : 0,
									audioSessionId : 0,
									touchEnabled : false,
									linegraphRenderer : {
										strokeWidth : 1 * Ti.Platform.displayCaps.logicalDensityFactor,
										color : station.color || '#ffffff'
									}
								});
							}
							if (!$.radiotextView) {
								$.radiotextView = Ti.UI.createView({
									height : 40,
									bottom : 0,
									backgroundColor : station.color || 'black',
								});
								$.radiotextView.add(Ti.UI.createLabel({
									color : 'white',
									font : {
										fontSize : 20,
										fontFamily : 'Rambla-Bold'
									},
									width : Ti.UI.FILL,
									horizontalWrap : false,
									ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
									left : 10,
									right : 10
								}));
							}
							$.visualizerView && $.add($.visualizerView);
							$.add($.radiotextView);
							break;
						}
						lastStatus = e.status;
					}
				});
			}
		});
	}

	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup,

	});
	/* display of tuning wheel */
	// https://github.com/prashantsaini1/scrollable_animation
	$.favContainerView = ScrollableView.createScrollableView({
		clipViews : false,
		currentPageIndicatorColor : '#f44',
		pageIndicatorColor : '#a00',
		pagingControlOnTop : true,
		showPagingControl : true,
		top : 0,
		padding : {
			left : 280,
			right : 280
		},
		overlayEnabled : true,
		width : '100%',
		height : SCREENWIDTH,
		views : getFavViews()
	});
	Animation.setAnimation($.favContainerView, Animation.ROTATE_DOWN);

	$.stationList = Ti.UI.createTableView({
		top : SCREENWIDTH,
		opacity : 1,
		backgroundColor : '#fff',
		data : radiostations.map(createRow)
	});
	$.add($.favContainerView);
	$.add($.stationList);
	$.stationList.addEventListener("click", function(e) {
		console.log("CLICKonStationlist");
		const station = JSON.parse(e.rowData.itemId);
		toggleStation(station);
	});
	$.favContainerView.addEventListener("click", function(e) {
		console.log("CLICKonFavs");
		try {
			const station = JSON.parse(e.source.itemId);
			toggleStation(station);
		} catch(E) {
			console.log(E);
		}
	});
	if (Favs.getCount() == 0) {
		const tileView = require('ui/common/radio.stationlist')();
		$.add(tileView);
		tileView.addEventListener('click', function(e) {
			const station = JSON.parse(e.source.itemId);
			toggleStation(station);
			$.remove(tileView);

		});
	}

	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget