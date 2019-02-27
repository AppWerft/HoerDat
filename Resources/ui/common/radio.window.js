const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Visualizer = require('ti.audiovisualizerview');
const Permissions = require('vendor/permissions');

module.exports = function(_tabgroup) {
	const radiostations = require('model/radiostations');
	const Animation = require("ti.scrollable.animation");
	const Favs = require("controls/favs");
	const Streamer = require('vendor/audiostreamer.adapter');
	Streamer.init(_tabgroup, "applogo");
	var lastStatus = "STOPPED";
	var currentStation = null;
	function getFavViews() {
		return Favs.getAll().map(function(station) {
			var view = Ti.UI.createView({
				itemId : JSON.stringify(station),
				width : '88%',
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
			return view;
		});
	}

	function toggleStation(station) {
		Permissions.requestPermissions('RECORD_AUDIO', function(success) {
			if (!success)
				return;
			if (lastStatus == "BUFFERING") {
				return;
			}
			if (station != currentStation) {
				Favs.add(station);
				$.favContainerView.setViews(getFavViews());
			}
			if ($.favContainerView.currentPage != 0)
				$.favContainerView.scrollToView(0);
			console.log("lastStatus: " + lastStatus);
			if (lastStatus == "PLAYING")
				Streamer.stop();
			else if (lastStatus == "STOPPED")
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
								top : SCREENWIDTH,
								duration : 700
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
							$.stationList.animate({
								top : 900,
								duration : 700
							});
							if (!$.visualizerView) {
								/*$.visualizerView = Visualizer.createView({
								 top : 50,
								 //backgroundColor : '#8000',
								 height : Ti.UI.FILL,
								 bottom : 20,
								 audioSessionId : 0,
								 touchEnabled : false,
								 lifecycleContainer : _tabgroup,
								 bargraphRenderer : {
								 divisions : 12,
								 barWidth : SCREENWIDTH / 12 * Ti.Platform.displayCaps.logicalDensityFactor,
								 color : station.color || '#ffffff'
								 }
								 });*/
								$.visualizerView = Visualizer.createView({
									
									//backgroundColor : '#8000',
									height : 180,
									bottom : 0,
									
									audioSessionId : 0,
									touchEnabled : false,
									//lifecycleContainer : _tabgroup,
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
		});
	}

	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup,

	});

	var messageView = require('ui/marquee.widget')();
	messageView.setTop(10);
	/* display of tuning wheel */
	// https://github.com/prashantsaini1/scrollable_animation
	$.favContainerView = Ti.UI.createScrollableView({
		top : 0,
		width : Ti.UI.FILL,
		height : (Favs.getAll().length == 0) ? 0 : SCREENWIDTH,
		views : getFavViews()
	});
	Animation.setAnimation($.favContainerView, Animation.ROTATE_DOWN);
	$.stationList = Ti.UI.createTableView({
		backgroundColor : '#fff',
		top : SCREENWIDTH,
		data : radiostations.map(function(station) {
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
			const path = "/images/" + station.logo + ".png";
			row.add(Ti.UI.createImageView({
				left : 2.5,
				top : 2.5,
				width : 40,
				height : 40,
				image : path,
				touchEnabled : false
			}));
			return row;
		})
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
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget