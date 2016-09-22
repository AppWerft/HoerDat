var АктйонБар = require('com.alcoapps.actionbarextras');
var Lorem = require("vendor/loremipsum");

/* this module will called from _e.source on open event */
module.exports = function(_openevent) {
	АктйонБар.title = 'HörDat';
	АктйонБар.subtitle = 'Dein Hörspielkalender';
	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	АктйонБар.backgroundColor = "#225588";
	Ti.App.addEventListener('app:set', function(_e) {
		console.log(_e);
		//АктйонБар.subtitle = _e.subTitle;
	});
	var activity = _openevent.source.getActivity();
	if (activity) {
		var data = activity.getIntent().getData();
		activity.onCreateOptionsMenu = function(_menu) {
			activity.actionBar.displayHomeAsUp = false;
			_menu.menu.add({
				title : 'Über uns',
				icon : Ti.App.Android.R.drawable.ic_action_about,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			}).addEventListener("click", function(_e) {
				require('ui/common/about.window')().open();
			});
			_menu.menu.add({
				title : 'Suche',
				icon : Ti.App.Android.R.drawable.ic_action_search,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			}).addEventListener("click", function(_e) {
				require('ui/common/search.window')().open();
			});
			_menu.menu.add({
				title : 'Airlino',
				icon : Ti.App.Android.R.drawable.airlino,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			}).addEventListener("click", function(_e) {
				var Airlino = require("de.appwerft.airlino");
				Airlino.connect({
					onSuccess : function(_e) {
						Ti.UI.createNotification({
							message : "Airlino gefunden \n" + _e.endpoint
						}).show();
					},
					onError : function() {
					},
					timeout : 5
				});
			});
		};
		var last = {};
		activity.invalidateOptionsMenu();
		/*
		var Airlino= require("de.appwerft.airlino");
		/*Airlino.isAvailable({
			onResult: function(e) {
				console.log(e.result);
			}
		});	
		Airlino.startScan({
			onSuccess: function(e) {
				console.log(e.result);
			},
			onError: function(e) {
				console.log(e);
			}
		});*/
		/*
		 activity.onPause = function() {
		 console.log('onPause <<<<<<<<<<<<<<<<<<<<<<<<<<<');
		 last.title = АктйонБар.title;
		 last.subtitle = АктйонБар.subtitle;
		 };
		 activity.onResume = function() {
		 console.log('onResume >>>>>>>>>>>>>>>>>>>>>>>>>>>');
		 АктйонБар.title = last.title || 'HörDat';
		 АктйонБар.subtitle = last.subtitle || 'Dein Hörspielkalender';
		 };*/
		Ti.Gesture.addEventListener('orientationchange', function() {
			if (Ti.Platform.displayCaps.platformHeight > Ti.Platform.displayCaps.platformWidth) {
				activity.actionBar.show();
			} else
				activity.actionBar.hide();
		});
		

		var AudioControls = require("de.appwerft.audiocontrols");
		var icons = [AudioControls.ICON_REWIND, AudioControls.ICON_PAUSE, AudioControls.ICON_FORWARD];
		var updateControl = function() {
			AudioControls.updateRemoteAudioControl({
				image : "http://lorempixel.com/1500/1500/cats/" + "?" + new Date().getTime(),
				artist : Lorem(12),
				title : Lorem(4),
				icons : icons
			});
		};
		var playing = false;
		AudioControls.createRemoteAudioControl({
			onClick : function(_event) {
				console.log("logicalDensityFactor==" + Ti.Platform.displayCaps.density);
				;
				icons[1] = (icons[1] == AudioControls.ICON_PAUSE) ? AudioControls.ICON_PLAY : AudioControls.ICON_PAUSE;
				updateControl();
				playing = !playing;
				if (_event.cmd == "rew") {
					console.log("send hiding to module =======");
					AudioControls.hideRemoteAudioControl();
					setTimeout(function() {
					}, 3000);
				}
			},
			vibrate : 26,
			title : Lorem(3),
			image : "http://lorempixel.com/250/250/cats/" + "?" + new Date().getTime(),
			artist : Lorem(5),
			icons : [AudioControls.ICON_REWIND, AudioControls.ICON_PAUSE, AudioControls.ICON_FORWARD],
			iconBackgroundColor : "#44aaaa"
		});
		
	}
	//require('vendor/versionsreminder')();
};
