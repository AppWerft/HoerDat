module.exports = function(_tabgroup) {
	const radiostations = require('model/radiostations');
	const Animation = require("ti.scrollable.animation");
	const Favs = require("controls/favs");
	const Streamer = require('vendor/audiostreamer.adapter');
	const AudioNotification = require('de.appwerft.audionotification');
	

	function getFavViews() {
		return Favs.getAll().map(function(station) {
			var view = Ti.UI.createView({
				itemId : JSON.stringify(station)
			});
			view.add(Ti.UI.createImageView({
				touchEnabled : false,
				image : '/images/' + station.logo.toLowerCase() + '.png',
				width : '90%',
				height : 'auto'
			}));
			return view;
		});
	}

	
	function playStation(station) {
		const logo ="/images/" + station.logo.toLowerCase() + ".png";
		const Notification = AudioNotification.createNotification({
			// lifecycleContainer : options.lifecycleContainer,
			title : station.name,
			subtitle : "",
			image : logo,
			icon : "applogo"
		});
		Notification.show();
		Streamer.play({
			url : station.stream,
			logo : station.logo,
			playlist : station.playlist,
			title : station.name
		}, function(e) {
			console.log(e);
		});
	}

	var $ = Ti.UI.createWindow({
		backgroundColor : '#000033',
		tabgroup : _tabgroup,
		layout : 'vertical'
	});

	var messageView = require('ui/marquee.widget')();
	messageView.setTop(10);
	/* display of tuning wheel */
	// https://github.com/prashantsaini1/scrollable_animation
	$.favContainerView = Ti.UI.createScrollableView({
		top : 0,
		width : '120%',
		height : (Favs.getAll().length == 0) ? 0 : 400,
		views : getFavViews()
	});
	Animation.setAnimation($.favContainerView, Animation.ROTATE_DOWN);
	$.stationList = Ti.UI.createTableView({
		backgroundColor : '#fff',
		top : 10,
		data : radiostations.map(function(station) {
			const row = Ti.UI.createTableViewRow({
				height : 50,
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
					fontSize : 20,
					fontFamily : "Rambla"
				},
				touchEnabled : false
			}));
			const path = "/images/" + station.logo.toLowerCase() + ".png";

			row.add(Ti.UI.createImageView({
				left : 2.5,
				top : 2.5,
				width : 50,
				height : 50,
				image : path,
				touchEnabled : false
			}));
			return row;
		})
	});

	/*var playStopControlView = require('vendor/radio.control').createView({
	 messageView : messageView,
	 lifecycleContainer : _tabgroup
	 });

	 playStopControlView.onSelect = function() {
	 return wheelView.getActiveSegment();
	 };*/
	$.add($.favContainerView);
	$.add($.stationList);

	//$.add(messageView);
	//$.add(playStopControlView);
	//$.addEventListener('open', require('ui/common/radiowheel.onopen'));
	$.stationList.addEventListener("click", function(e) {
		const favList = Favs.add(JSON.parse(e.rowData.itemId));
		$.favContainerView.setViews(getFavViews());
		$.favContainerView.scrollToView(0);
	});
	$.favContainerView.addEventListener("click", function(e) {
		playStation(JSON.parse(e.source.itemId));
	});
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget