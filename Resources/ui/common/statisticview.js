const Pool = require("controls/pool");

module.exports = function(H) {
	function renderValue(label, value) {
		const strip = Ti.UI.createView({
			top : 0,
			height : 50,
		});
		strip.add(Ti.UI.createLabel({
			text : label,
			left : 10,
			color : '#666',
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
	$.addEventListener("swipe", function(e) {
		$.onSwipe(e);
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
			borderColor : 'silver'
		});
		$.add($.container);
		const stats = Pool.getStorageStatistics();
		if (stats.externalTotal) {
			const our = stats.bytesconsumed / stats.externalTotal;
			const other = (stats.externalTotal - stats.externalFree - stats.bytesconsumed)
					/ stats.externalTotal;
			$.container.add(Ti.UI.createView({
				backgroundColor : 'gray',
				left : 0,
				height : H,
				width : (other * 100) + '%'
			}));
			$.container.add(Ti.UI.createView({
				backgroundColor : '#225588',
				left : (other * 100) + '%',
				height : H,
				width : (stats.bytesconsumed / stats.externalTotal * 100) + '%'
			}));
			$.add(renderValue("Gesamtgröße", stats.externalTotal + " MB"));
			$.add(renderValue("Fremdverbrauch", (stats.externalTotal
					- stats.externalFree - stats.bytesconsumed)
					+ " MB"));
			$
					.add(renderValue("Hörspielcache", (stats.bytesconsumed)
							+ " MB"));
			$.add(renderValue("Hörspielanzahl", stats.files));

		}

	};
	return $;
};