const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;


exports.addTiles = function(PATH,$) {
	const Radiostations = require('controls/favs').getAll();
	Radiostations.forEach(function(radio,i){ 
		/*if (i<1) {
			const logo = PATH.replace('%s', radio.logo);
			console.log(logo);
			const  shortcut =Ti.UI.createShortcutItem({
				id : radio.logo,
				title : radio.logo,
				description : radio.name,
				icon : logo,
			});
			
			shortcut.show();
		}*/
	});

	function createAndAddTile(station, i) {
		const W = SCREENWIDTH / 3, H = SCREENWIDTH / 3;
		var top=0, left=0, width=W, height=H;
		switch (i) {
		case 0:
			width = W*2;
			break;
		case 1:
			left = W*2;
			break;
		case 2:
			top = W;
			left = W*2;
			break;
		default:
			top = Math.floor((i+3) / 3) * W;
			left = i % 3 * W;
		}
		const tile = Ti.UI.createView({
			width : width,
			height : width,
			itemId : JSON.stringify(station),
			top : top,
			left : left,
			opacity : station.total>0 ? 1 : 0.7,
			backgroundImage : PATH.replace('%s', station.logo),
		});
		if ($.children[i]) {
			$.replaceAt({
				position:i,
				view:tile
			});
		}	else {
		$.add(tile); }
	}
	
	Radiostations.forEach(createAndAddTile);
	return $;
};
// https://github.com/kgividen/TiCircularSliderBtnWidget
