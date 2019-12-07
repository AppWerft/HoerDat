const Wecker = require('controls/alarms'),
    Moment = require("vendor/moment");

module.exports = function() {
	const $ = Ti.UI.createTableView({
		backgroundColor : '#eeffffff',
		headerTitle : 'Vorgemerkte Sendungen',
		opacity:0.5
	});
	$.updateContent = function() {
		$.animate({
			opacity:1
		});
		$.data = Wecker.listAll().map(require('ui/common/alarm_row.widget'));
	};
	return $;
};
