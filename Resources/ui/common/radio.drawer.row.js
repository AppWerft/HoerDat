const PATH = '/images/stationlogos3/%s.png';

module.exports =  (station,i) => {
		const $ = Ti.UI.createTableViewRow({
			height : 50,
			itemId : station.station
		});
		$.add(Ti.UI.createSwitch({
			right : 7,
			width : 50,
			height : 45,
			style : Ti.UI.Android.SWITCH_STYLE_SWITCH,
			value : station.enabled ? true : false,
			itemId : station.station
		}));
		$.add(Ti.UI.createView({
			left : 5,
			width : 45,
			height : 45,
			backgroundImage : '/images/mini/'+ station.station+ '.png',
		}));
		$.add(Ti.UI.createLabel({
			left : 60,
			color : '#333',
			font : {
				fontFamily : 'Rambla',
				fontSize : 16,
				fontWeight : 'bold'
			},
			text : station.name
		}));
		return $;
	};