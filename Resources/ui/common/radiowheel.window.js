const OFFSET = 100,
    TILESIZE = 210,
    RADIUS = 540,
    WHEELSIZE = 2 * RADIUS + TILESIZE * 1.3;

module.exports = function() {
	var model = {
		radiostations : require('model/radiostations'),
		currentstation : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0),
		φ : 0
	};
	/* display of station name on top */
	var messageView = require('ui/marquee.widget')();
	
	messageView.top = 30;
	/* display of tuning wheel */
	var wheelView = require('vendor/wheel.widget')({
		segmentIcons : model.radiostations.map(function(s) {
			return '/images/' + s.logo.toLowerCase() + '.png';
		}),
		iconSize : 200,
		radius : 500,
		verticalOffset : 120,
		activeSegment : model.currentstation
	});
	wheelView.onChange = function(ndx) {
		Ti.App.Properties.setInt('CURRENT_STATION_INDEX', ndx);
		Ti.App.Properties.setObject('CURRENT_STATION', model.radiostations[ndx]);
	};
	var playStopControl = require('vendor/radio.control');
	playStopControl.onSelect = wheelView.onSelect;
	
	var $ = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	$.add(wheelView);
	$.add(messageView);
	$.add(playStopControl.getView({
		messageView : 	messageView
	}));
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget