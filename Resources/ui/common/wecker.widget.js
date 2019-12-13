const Wecker = require('controls/alarms'),
    Moment = require("vendor/moment");

module.exports = function(item) {
	var $;
	if (item && Moment(item.start) > Moment()) {
		const json = JSON.stringify(item);
		const status = Wecker.isActive(json);
		$ = Ti.UI.createImageView({
			itemId : json,
			status : status,
			image : '/images/wecker_' + ( status ? 'active' : 'passiv') + '.png',
			opacity : status ? 0.7 : 0.2,
			top: 5,
			
			left : 10,
			width : 50,
			height : 25

		});
	} else
		$ = Ti.UI.createView({
			width : 1,
			height : 1
		});
	$.toggleStatus = () => {
		Ti.Media.vibrate();
		switch ($.status) {
		case false:
			message = 'Sendung zur Alarmliste hinzugefügt.';
			$.status = true;
			$.image = $.image.replace('passiv', 'active');
			$.opacity = 0.6;
			Wecker.add($.itemId);
			break;
		case true:
			message = 'Sendung von Alarmliste entfernt.';
			$.status = false;
			$.image = $.image.replace('active', 'passiv');
			$.opacity = 0.2;
			Wecker.remove($.itemId);
			break;
		default:
			message = 'kaputte Sendung von Alarmliste entfernt.';
			$.status = false;
			$.image = $.image.replace('active', 'passiv');
			$.opacity = 0.2;
			Wecker.remove($.itemId);
		}

		message && Ti.UI.createNotification({
			message : message
		}).show();
	}

	return $;
};

