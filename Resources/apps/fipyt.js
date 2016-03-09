var abx = require('com.alcoapps.actionbarextras');
var Moment = require('vendor/moment');
var screenwidth = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor,
    screenheight = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;

module.exports = function(_args) {
	var ytlist = _args.ytlist;
	var interprete = _args.interprete.replace(',','');

	var $ = Ti.UI.createWindow({
		fullscreen : true,
	});
	$.container = Ti.UI.createTableView({
		backgroundColor : 'black'
	});
	$.add($.container);
	if (ytlist.length == 0) {
		Ti.UI.createNotification({
			message : 'Leider kein Suchergebnis.'
		}).show();
		$.close();
	}
	var rows = ytlist.map(function(v) {
		var row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE
		});
		row.add(Ti.UI.createImageView({
			left : 0,
			top : 0,
			height : 90,
			width : 120,
			image : v.image
		}));
		row.add(Ti.UI.createView({
			top : 5,
			right : 10,
			left : 130,
			bottom : 10,
			layout : 'vertical'
		}));
		row.children[1].add(Ti.UI.createLabel({
			top : 0,
			left : 0,
			text : v.title,
			color : '#ddd',
			font : {
				fontFamily : 'Montserrat-Bold',
				fontSize : 20
			},
		}));
		row.children[1].add(Ti.UI.createLabel({
			top : 0,
			left : 0,
			text : v.description,
			color : '#ddd',
			font : {
				fontFamily : 'Montserrat-Light',
				fontSize : 12
			},
		}));
		return row;
	});
	$.container.setData(rows);
	
	$.addEventListener('open', function(_e) {
		abx.title = 'YouTube';
		abx.backgroundColor = "#EE2887";
		abx.statusbarColor = "#EE2887";
		abx.subtitle = interprete;
		abx.titleFont = "Montserrat-Regular";
		abx.subtitleColor = "#ccc";
		var activity = $.getActivity();
		if (activity) {
			activity.onCreateOptionsMenu = function(e) {
				activity.actionBar.displayHomeAsUp = true;
			};
			//activity.actionBar.homeButtonEnabled = true;
			activity.actionBar.onHomeIconItemSelected = function() {
				$.close();
			};
		}
		activity.invalidateOptionsMenu();
	});
	return $;
};
