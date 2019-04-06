const AS = require("de.appwerft.audioselector");

exports.create = function (device,type,active) {
	
	const $ = Ti.UI.createView({
		height : 45,
		top : 5,
		itemId : type,
		active : device.active,
		opacity : (active===true) ? 1 : 0.4,
		borderRadius : 20,
		backgroundColor : "#225588"
	});
	$.add(Ti.UI.createLabel({
		text : device.label,
		left : 80,
		textAlign : 'left',
		width : Ti.UI.FILL,
		color : 'white',
		touchEnabled : false,
		font : {
			fontFamily : 'Rambla',
			fontSize : 22
		}
	}));
	$.add(Ti.UI.createImageView({
		left : 20,
		height : 30,
		touchEnabled : false,
		image : device.icon
	}));
	return $;
};