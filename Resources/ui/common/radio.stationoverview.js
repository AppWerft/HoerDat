const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

const $ = function(_path) {
	this.PATH = _path;
	this.total=0;
	this.view = Ti.UI.createScrollView({
		scrollType : 'vertical',
		backgroundColor : '#ccffffff'
	});
	
	return this;
};

$.prototype.getView = function() {
	return this.view;
};

$.prototype.updateRadioStationTiles = function() {
	const PATH = this.PATH;
	const Radiostations = require('controls/favs').getAllEnabled();
	if (Radiostations.length != this.total) {
		this.view && this.view.removeAllChildren();
	}
	this.total= Radiostations.length;
	const createAndAddTile = (station, i) => {
		const W = SCREENWIDTH / 3,
		    H = SCREENWIDTH / 3;
		var top = 0,
		    left = 0,
		    width =
		    W,
		    height =
		    H;
		switch (i) {
		case 0:
			width = W * 2;
			break;
		case 1:
			left = W * 2;
			break;
		case 2:
			top = W;
			left = W * 2;
			break;
		default:
			top = Math.floor((i + 3) / 3) * W;
			left = i % 3 * W;
		}
		backgroundImage = PATH.replace('%s', station.station);
		
		const tile = Ti.UI.createView({
			width : width,
			height : width,
			itemId : JSON.stringify(station),
			top : top,
			left : left,
			opacity : station.total > 0 ? 1 : 0.7,
			backgroundImage : backgroundImage,
		});
		if (this.view.children[i]) {
			this.view.replaceAt({
				position : i,
				view : tile
			});
		} else {
			this.view.add(tile);
		}
	}
	Radiostations.forEach(createAndAddTile);

};
// https://github.com/kgividen/TiCircularSliderBtnWidget

exports.create = function(args) {
	return new $(args);
};
