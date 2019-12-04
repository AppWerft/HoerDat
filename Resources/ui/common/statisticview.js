const Pool = require("controls/pool");

const COLORS = {
	USED : 'gray',
	DL : '#225588',
	FREE : '#009900'
};

module.exports = function(H) {
	function renderValue(label, value,color) {
		const strip = Ti.UI.createView({
			top : 0,
			height : 40,
		});
		strip.add(Ti.UI.createLabel({
			text : label,
			left : 10,
			color : color,
			font : {
				fontFamily : 'Rambla-Bold',
				fontSize : 22
			}
		}));
		strip.add(Ti.UI.createLabel({
			text : value,
			color : '#333',
			font : {
				fontFamily : 'Rambla',
				fontSize : 18
			},
			right : 10
		}));
		return strip;
	}
	const $ = Ti.UI.createView({
		top : 0,
		layout : 'vertical',
		backgroundColor : 'white'
	});
	$.container = Ti.UI.createView({
		top : 0,
		height : H,
		borderWidth : 1,
		borderColor : 'silver'
	});
	$.add($.container);
	$.renderView = function() {
		$.removeAllChildren();
		$.container = Ti.UI.createView({
			top : 0,
			height : H,
			borderWidth : 1,
			backgroundColor: COLORS.FREE,
			borderColor : 'silver'
		});
		$.add($.container);
		const stats = Pool.getStorageStatistics();
		if (stats.externalTotal) {
			const our = stats.bytesconsumed / stats.externalTotal;
			const other = (stats.externalTotal - stats.externalFree - stats.bytesconsumed)
					/ stats.externalTotal;
			$.container.add(Ti.UI.createView({
				backgroundColor : COLORS.USED,
				left : 0,
				height : H,
				width : (other * 100) + '%'
			}));
			$.container.add(Ti.UI.createView({
				backgroundColor : COLORS.DL,
				left : (other * 100) + '%',
				height : H,
				width : (stats.bytesconsumed / stats.externalTotal * 100) + '%'
			}));
			$.add(renderValue("Gesamtgröße", (stats.externalTotal / 1000)
					.toFixed(2)
					+ " GB",'#222'));
			$.add(renderValue("Fremdverbrauch", ((stats.externalTotal
					- stats.externalFree - stats.bytesconsumed) / 1000)
					.toFixed(2)
					+ " GB",COLORS.USED));
			$.add(renderValue("Hörspielcache", (stats.bytesconsumed / 1000)
					.toFixed(2)
					+ " GB",COLORS.DL));
			$.add(renderValue("noch frei", (stats.externalFree / 1000)
					.toFixed(2)
					+ " GB",COLORS.FREE));
			$.add(renderValue("Anzahl, gesamt", stats.counttotal,'#444'));
			$.add(renderValue("Anzahl, lokal", stats.countlocal,'#444'));
			$.add(renderValue("Laufzeit, gesamt", stats.durationtotal,'#444'));
			$.add(renderValue("Laufzeit, lokal", stats.durationlocal,'#444'));
			$.add(renderValue("davon schon gehört", stats.progresslocal,'#444'));
		}
	};
	return $;
};