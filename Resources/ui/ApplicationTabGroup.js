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
		$.addTab(Ti.UI.createTab({
			title : 'Podcasts',
			icon : '/images/podcasts.png',
			window : require('ui/common/podcasts.window')($),
			ndx : 3
		}));
		$.setActiveTab(Ti.App.Properties.getInt("ACTIVE_TAB",1));
     	$.addEventListener('close', function() {
		Ti.App.fireEvent('stopRadio');
	});
	
	
	$.getTabs().forEach(function(_tab) {
		_tab.addEventListener('selected', function(_e) {
			Ti.App.Properties.setInt('ACTIVE_TAB', $.getActiveTab().ndx);
		});
	});

	return $;
};
/*
 * 
 
 * var intent = Ti.Android.createIntent({ action : Ti.Android.ACTION_MAIN, flags :
 * Ti.Android.FLAG_ACTIVITY_NEW_TASK });
 * intent.addCategory(Ti.Android.CATEGORY_HOME);
 * Ti.Android.currentActivity.startActivity(intent);
 */