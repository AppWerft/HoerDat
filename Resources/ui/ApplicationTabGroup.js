module.exports = function() {
	const $ = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : true,
		swipeable : false,

		tabsBackgroundColor : '#1D5987',
		style : Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION,
		orientationModes : [ Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT ]
	});

	$.addEventListener('open', require('ui/common/main.menu'));
	setTimeout(function() {
		$.addTab(Ti.UI.createTab({
			title : 'Kalender',
			icon : '/images/1.png',
			window : require('ui/common/scheduler.window')($),
			ndx : 0
		}));

		$.addTab(Ti.UI.createTab({
			title : 'LinearRadio',
			icon : '/images/2.png',
			window : require('ui/common/radio.window')($),
			ndx : 1
		}));
		$.addTab(Ti.UI.createTab({
			title : 'Hörspiele',
			icon : '/images/3.png',
			window : require('ui/common/cachedpool.window')($),
			ndx : 2
		}));
		$.setActiveTab(1);
	}, 20);
	require('de.appwerft.watchdog').start({
		interval : 60 * 1000 * 10, // 10 min
		debug : true,
		exact : false
	});

	$.addEventListener('close', function() {
		Ti.App.fireEvent('stopRadio');
	});
	return $;
};
/*
 * var intent = Ti.Android.createIntent({ action : Ti.Android.ACTION_MAIN, flags :
 * Ti.Android.FLAG_ACTIVITY_NEW_TASK });
 * intent.addCategory(Ti.Android.CATEGORY_HOME);
 * Ti.Android.currentActivity.startActivity(intent);
 */