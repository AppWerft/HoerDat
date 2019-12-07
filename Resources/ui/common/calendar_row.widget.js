var Moment = require('vendor/moment');
Moment.locale('de');
const WeckerView = require('ui/common/wecker.widget');

module.exports = function(item) {
	const $= Ti.UI.createTableViewRow({
		height : 150,
		hasDetail : true,
		itemId : item
	});
	$.add(Ti.UI.createImageView({
		image : item.stationlogo,
		defaultImage : '/images/defaultimage.png',
		top : 10,
		touchEnabled : false,
		left : 5,
		width : 60,
		height : 60
	}));
	$.add(WeckerView(item));
	var container = Ti.UI.createView({
		left : 80,
		top : 5,
		bottom : 20,
		touchEnabled : false,
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	$.add(container);
	if (!item.subtitle)
		container.add(Ti.UI.createLabel({
			text : item.title,
			left : 0,
			top : 0,
			right : 0,
			touchEnabled : false,
			height : Ti.UI.SIZE,
			color : '#3F79A9',
			font : {
				fontSize : 20,
				fontFamily : 'Rambla-Bold',
				fontWeight : 'bold'
			}
		}));
	else {
		container.add(Ti.UI.createLabel({
			text : item.title,
			left : 0,
			top : 8,
			right : 0,
			touchEnabled : false,
			height : Ti.UI.SIZE,
			color : '#111',
			font : {
				fontSize : 14,
				fontFamily : 'Rambla-Bold',
				fontWeight : 'bold'
			}
		}));
		container.add(Ti.UI.createLabel({
			text : item.subtitle,
			left : 0,
			top : 0,
			bottom : 8,
			touchEnabled : false,
			right : 10,
			height : Ti.UI.SIZE,
			color : '#333',
			font : {
				fontSize : 16,
				fontFamily : 'Rambla-Bold',
				fontWeight : 'bold'
			}
		}));

	}

	item.start && container.add(Ti.UI.createLabel({
		text : Moment(item.start).format('dddd  HH:mm') + ' Uhr\n' + item.meta,
		left : 0,
		top : 0,
		right : 10,
		height : Ti.UI.SIZE,
		color : '#333',
		font : {
			fontSize : 16,
			fontFamily : 'Rambla-Bold'
		}
	}));
	item.produktion && $.add(Ti.UI.createLabel({
		text : item.produktion,
		left : container.left,
		bottom : 0,
		right : 10,
		height : Ti.UI.SIZE,
		touchEnabled : false,
		color : '#444',
		font : {
			fontSize : 14,
			fontFamily : 'DroidSans',

		}
	}));
	return $;
};
