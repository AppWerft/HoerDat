module.exports = function() {
	var radiostations = require('model/radiostations');
	var $ = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	/* display of station name on top */
	var messageView = require('ui/marquee.widget')();
	messageView.setTop(10);
	/* display of tuning wheel */
	var wheelView = require('vendor/wheel.widget')({
		segmentIcons : radiostations.map(function(s) {
			return '/images/' + s.logo.toLowerCase() + '.png';
		}),
		iconSize : 240,
		radius : 640,
		verticalOffset : 90,
		activeSegment : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0)
	});
	var playStopControlView = require('vendor/radio.control').createView({
		messageView : messageView
	});
	
	/* bridge between wheel and player*/
	playStopControlView.onSelect = function() {
		return wheelView.getActiveSegment();
	};
	$.add(wheelView);
	$.add(messageView);
	$.add(playStopControlView);
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget