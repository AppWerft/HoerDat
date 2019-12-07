const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const VisualizerModule = require('ti.audiovisualizerview');
const PATH = '/images/stationlogos3/%s.png';
const Permissions = require('vendor/permissions');

var $ = function(station) {
	var backgroundImage = PATH.replace('%s', station.station);
	this.view = Ti.UI.createView({
		backgroundColor : 'transparent'
	});
	this.view.add(Ti.UI.createView({
		width : SCREENWIDTH,
		height : SCREENWIDTH,
		top : 0,
		backgroundImage : backgroundImage
	}));
	this.radiotextView = Ti.UI.createView({
		height : 40,
		bottom : 0,
		backgroundColor : station.color
	});
	this.radiotextView.add(Ti.UI.createLabel({
		color : station.textcolor,
		font : {
			fontSize : 22,
			fontFamily : 'Rambla-Bold'
		},
		text : station.name,
		width : Ti.UI.FILL,
		horizontalWrap : false,
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		left : 10,
		right : 10
	}));
	
	this.view.add(this.radiotextView);
	//playerView.children[0].addEventListener('click', stopPlayer);
	return this;
};

$.prototype.getView = function() {
	return this.view;
};
$.prototype.addVisualization = function() {
	var v = VisualizerModule.createView({
		center : {
			y : SCREENWIDTH + 100
		},
		audioSessionId : 0,
		touchEnabled : false,
		linegraphRenderer : {
			strokeWidth : 2 * Ti.Platform.displayCaps.logicalDensityFactor
		}
	});
	this.view.add(v);
};
$.prototype.setText = function(text) {
	this.radiotextView.children[0].text = text;
};
exports.createView = function(s) {
	return new $(s);
};
