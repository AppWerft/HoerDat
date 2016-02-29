module.exports = function() {
	var restored = false;
	var reStoreFunc = function() {
		if (!restored)
			setTimeout(function() {
				RadioWheel && RadioWheel.go2Segment(model.currentstation);
				ui.StatusLog.setText(model.currentstation);
				restored = true;
			}, 500);
		return;
	};
	var ui = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	var model = {
		radiostations : require('model/radiostations'),
		currentstation : Ti.App.Properties.getInt('CURRENT_STATION_INDEX', 0),
		φ : 0
	};
	var segment = 360 / model.radiostations.length;
	ui.StatusLog = Ti.UI.createLabel({
		bottom : 0,
		height : 0,
		backgroundColor : 'black',
		width : Ti.UI.FILL,
		zIndex : 9999,
		color : 'silver',
		textAlign : 'center',
		text : ''
	});
	ui.Equalizer = Ti.UI.createView({
		bottom : 0,
		height : 20,
		width : 200
	});

	var container = Ti.UI.createView({
		bottom : '20%'
	});
	ui.add(container);
	ui.add(ui.Equalizer);
	//  setInterval(function(){
	//     ui.Equalizer.backgroundImage='/equalizer/e-'+Math.floor(Math.random()*20) +'.png';
	// },20);
	ui.stationviews = [];
	var images = [];
	for (var i = 0; i < model.radiostations.length; i++) {
		images[i] = '/images/' + model.radiostations[i].logo.toLowerCase() + '.png';
	}
	var RadioWheel = new (require('ui/common/radiowheel.widget'))();
	container.add(RadioWheel.createView({
		images : images,
		width : 200,
		anchorPoint : {
			x : 0.5,
			y : 3.2
		}
	}));
	model.φ = model.currentstation * segment;
	ui.add(ui.StatusLog);
	ui.addEventListener('focus', function() {
		reStoreFunc();
	});
	ui.addEventListener('swipe', function(_e) {
		if (_e.direction == 'left' || _e.direction == 'right') {
			ui.PlayStopControl.hide();
			ui.PlayStopControl.stopPlayer();
			ui.StatusLog.setText('Radio angehalten.');
			model.currentstation = RadioWheel.rotateStep(_e.direction);
			console.log(model.currentstation);
			console.log(model.radiostations[model.currentstation]);
			Ti.App.Properties.setInt('CURRENT_STATION_INDEX', model.currentstation);
			var name = model.radiostations[model.currentstation].logo;
			ui.StatusLog.setText('Könnte jetzt ' + name + ' zuschalten.');
			ui.PlayStopControl.backgroundImage = '/images/play.png';
		}
	});
	RadioWheel.addEventListener('ready', function() {
		ui.PlayStopControl.show();
	});
	ui.PlayStopControl = new (require('controls/radio.control'))(model);
	ui.PlayStopControl.addEventListener('change', function(_e) {
		ui.StatusLog.setText(_e.message);
	});
	ui.PlayStopControl.createViews().forEach(function(v){
		ui.add(v);
		ui.add(v);
	});
	
	return ui;
};
