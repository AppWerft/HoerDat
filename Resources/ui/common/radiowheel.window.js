const OFFSET = 100,
    TILESIZE = 210,
    RADIUS = 540,
    WHEELSIZE = 2 * RADIUS + TILESIZE * 1.3;

module.exports = function() {
	var radiostations = require('model/radiostations');
	console.log(radiostations);
	/* display of station name on top */
	var messageView = require('ui/marquee.widget')();

	messageView.top = 30;
	/* display of tuning wheel */
	var wheelView = require('vendor/wheel.widget')({
		segmentIcons : radiostations.map(function(s) {
			return '/images/' + s.logo.toLowerCase() + '.png';
		}),
		iconSize : 200,
		radius : 500,
		verticalOffset : 120,
		activeSegment : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0)
	});
	wheelView.onChange = function(ndx) {
		console.log('wheelView.onChange = ' + ndx);
		Ti.App.Properties.setInt('CURRENT_STATION_INDEX', ndx);
	};     
	var playStopControl = require('vendor/radio.control');
	playStopControl.onSelect = wheelView.onSelect;
	var $ = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	$.add(wheelView);
	$.add(messageView);
	$.add(playStopControl.getView({
		messageView : messageView
	}));
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget