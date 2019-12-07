const Moment = require('vendor/moment');
function renderDate(foo) {
	return new Date(foo).toISOString().substr(11, 8);
}

const $ = function(_duration) {
	this.duration = _duration;
	this.Label = Ti.UI.createLabel({
		text : '',
		top : 20,
		left : 0,
		color : '#fff',
		backgroundColor : '#8000',
		font : {
			fontSize : 13,
			fontFamily : 'monospace'
		}
	});
	this.Bar = Ti.UI.createView({
		top : 0,
		zIndex : 999,
		height : 20,
		backgroundColor : '#6000'
	});
	this.Bar.add(Ti.UI.createView({
		left : 0,
		width : '0.1%',
		backgroundColor : 'orange'
	}));

	$.prototype.setProgress = function(_p) {// p is 0...1
		const p = _p > 1 ? p / this.duration : _p;
		this.Label.text = ' ' + renderDate(p * this.duration) + ' von ' + renderDate(this.duration);
		this.Bar.children[0].width = 100 * p + '%';
	};

	$.prototype.getLabelView = function() {
		return this.Label;
	};

	$.prototype.getBarView = function() {
		return this.Bar;
	};
	return this;
};

exports.createProgressViews = function(duration) {
	return new $(duration);
};
