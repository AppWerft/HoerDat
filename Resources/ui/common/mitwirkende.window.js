var Moment = require('vendor/moment');
Moment.locale('de');

function getMeta(p) {
	var $ = Ti.UI.createView({
		height : 45,
		top : 5,
		width: Ti.UI.FILL
	});
	$.add(Ti.UI.createLabel({
		left : 0,
		top : 0,
		text : p.rol,
		color : '#333',
		font : {
			fontSize : 16
		},
		height : 45,
		width : "40%"
	}));
	$.add(Ti.UI.createLabel({
		left : "60%",
		width : "60%",
		textAlign : 'left',
		height : 45,
		font : {
			fontSize : 22,
			fontFamily : 'Rambla-Bold'
		},
		text : p.mit,
		top : 0,
		color : '#444',
	}));
	return $;
};

module.exports = function(data) {
	var $ = Ti.UI.createWindow({
		title : data.title.trim(),
		backgroundColor : 'white',
		fullscreen : false,
		data : data
	});
	$.container = Ti.UI.createScrollView({
		scrollType : 'vertical',
		layout : 'vertical',
		left : 10,
		right : 10,
	});

	data.mitwirkende && data.mitwirkende.forEach(function(p) {
		console.log(p);
		$.container.add(getMeta(p));
	});
	$.add($.container);
	$.addEventListener('open', require('ui/common/mitwirkende.menu'));
	return $;
};
