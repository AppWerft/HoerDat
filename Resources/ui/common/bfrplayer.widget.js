const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const VisualizerModule = require('ti.audiovisualizerview');
const PATH = '/images/stationlogos3/%s.png';
const Permissions = require('vendor/permissions');

var $ = function(station) {
   
	var backgroundImage =  station.image;
	this.view = Ti.UI.createView({
		backgroundColor : 'transparent'
	});
	this.view.add(Ti.UI.createImageView({
		width : SCREENWIDTH,
		height : SCREENWIDTH,
		top : 0,
		defaultImage: '/images/bfr/bfr.png',
		image : backgroundImage
	}));
	this.radiotextView = Ti.UI.createView({
		height : 40,
		bottom : 0,
		backgroundColor :"#225588"
	});
	this.radiotextView.add(Ti.UI.createLabel({
		color : "white",
		font : {
			fontSize : 22,
			fontFamily : 'Rambla-Bold'
		},
		text : station.description,
		width : Ti.UI.FILL,
		horizontalWrap : false,
		ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
		left : 10,
		right : 10
	}));
	this.Progress = require('ui/common/bfr.progress.widget').create(station.duration);
	const onTap = () => {
	    this.view.add(this.Progress.view);
	    this.view.removeEventListener("singletap",onTap);
	    setTimeout(() => {
	        this.view.remove(this.Progress.view);
	        this.view.addEventListener("singletap",onTap);
	    },7000);
	}
	this.view.addEventListener("singletap",onTap);
	this.view.add(this.radiotextView);
	//playerView.children[0].addEventListener('click', stopPlayer);
	return this;
};

$.prototype.getView = function() {
	return this.view;
};
$.prototype.setProgress = function(p) {
  this.Progress.setProgress(p);  
};
$.prototype.addVisualization = function() {
	var v = VisualizerModule.createView({
		center : {
			y : SCREENWIDTH + 100
		},
		audioSessionId : 0,
		touchEnabled : false,
		linegraphRenderer : {
			strokeWidth : 1 * Ti.Platform.displayCaps.logicalDensityFactor
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
