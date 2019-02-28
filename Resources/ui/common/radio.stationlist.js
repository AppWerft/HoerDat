const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

function createRow(station) {
	const row = Ti.UI.createTableViewRow({
		height : 45,
		itemId : JSON.stringify(station)
	});
	row.add(Ti.UI.createLabel({
		left : 70,
		color : 'gray',
		textAlign : "left",
		width : Ti.UI.FILL,
		text : station.name,
		font : {
			fontWeight : 'bold',
			fontSize : 18,
			fontFamily : "Rambla"
		},
		touchEnabled : false
	}));

	row.add(Ti.UI.createImageView({
		left : 2.5,
		defaultImage : '/images/defaultimage.png',
		top : 2.5,
		width : 40,
		height : 40,
		image : "/images/mini/" + station.logo + ".png",
		touchEnabled : false
	}));
	return row;
};

module.exports = function() {
	function createAndAddTile(station, i) {
		const W = SCREENWIDTH / 3,
		    H = SCREENWIDTH / 3 + 20;
		const tile = Ti.UI.createView({
			width : W,
			height : H,
			
			itemId : JSON.stringify(station),
			top : Math.floor(i / 3) * W,
			left : i % 3 * W
		});
		tile.add(Ti.UI.createView({
			width : W,
			touchEnabled : false,
			height : W,
			top : 0,
			backgroundImage : '/images/' + station.logo + '.png'
		}));
		tile.add(Ti.UI.createLabel({
			bottom : 0,
			height : 20,
			width : W,
			text : station.name
		}));
		$.add(tile);
	}

	const Radiostations = require('model/radiostations');

	var $ = Ti.UI.createScrollView({
		scrollType : 'vertical',
		backgroundColor : 'white'
	});

	Radiostations.forEach(createAndAddTile);
	return $;
};
//https://github.com/kgividen/TiCircularSliderBtnWidget