var Moment = require('vendor/moment');
Moment.locale('de');

module.exports = function(item) {
	const $ = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		hasDetail : false,
		itemId : item
	});
	$.add(Ti.UI.createImageView({
		image : item.stationlogo,
		defaultImage : '/images/defaultimage.png',
		top : 10,
		touchEnabled : false,
		left : 5,
		width : 40,
		height : 40
	}));
	const container = Ti.UI.createView({
		left : 75,
		top : 5,
		bottom : 0,
		right:5,
		touchEnabled : false,
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	$.add(container);
	container.add(Ti.UI.createLabel({
		text : item.title,
		left : 0,
		top : 0,
		right : 0,
		touchEnabled : false,
		height : Ti.UI.SIZE,
		color : '#3F79A9',
		font : {
			fontSize : 16,
			fontFamily : 'Rambla-Bold',
			fontWeight : 'bold'
		}
	}));
	item.start && container.add(Ti.UI.createLabel({
		text : Moment(item.start).format('dddd  HH:mm') + ' Uhr',
		left : 0,
		top : 0,
		right : 10,
		height : Ti.UI.SIZE,
		color : '#333',
		font : {
			fontSize : 14,
			fontFamily : 'Rambla-Bold'
		}
	}));
	return $;
};
