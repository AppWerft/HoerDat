module.exports = function() {
	const $ = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : true,
		swipeable : false,
		tabsBackgroundColor : '#1D5987',
		style : Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});

	$.addEventListener('open', require('ui/common/main.menu'));
	$.addTab(Ti.UI.createTab({
		title : 'Kalender',
		hasDrawer : false,
		icon : '/images/1.png',
		window : require('ui/common/calendar.window')($),
		ndx : 0
	}));

	$.addTab(Ti.UI.createTab({
		title : 'LinearRadio',
		icon : '/images/2.png',
		hasDrawer : false,
		window : require('ui/common/radio.window')($),
		ndx : 1
	}));
	$.addTab(Ti.UI.createTab({
		title : 'Hörspiele',
		icon : '/images/3.png',
		hasDrawer : true,
		window : require('ui/common/cachedpool.window')($),
		ndx : 2
	}));
	/*$.addTab(Ti.UI.createTab({
	 title : 'Podcasts',
	 icon : '/images/podcasts.png',
	 window : require('ui/common/podcasts.window')($),
	 ndx : 3
	 }));*/
	$.setActiveTab(Ti.App.Properties.getInt("ACTIVE_TAB", 1));

	$.addEventListener('close', function() {
		Ti.App.fireEvent('stopRadio');
	});

	$.getTabs().forEach(function(_tab, _index) {
		var sc = Ti.UI.createShortcutItem({
			id : 'shortcut::' + _index,
			title : _tab.title,
			icon : _tab.icon,
			description : _tab.title,
		});
		//		sc.pin();
		if (Ti.App.Properties.getInt("ACTIVE_TAB", 1) == _index) {
			sc.show();
		}
		_tab.addEventListener('selected', function(_e) {
			Ti.App.Properties.setInt('ACTIVE_TAB', $.getActiveTab().ndx);
			Ti.App.fireEvent('app:tabchanged', {
				hasDrawer : $.getActiveTab().hasDrawer
			});
			var tab = $.getActiveTab();
			var sc = Ti.UI.createShortcutItem({
				id : 'shortcut::' + tab.ndx,
				title : tab.title,
				description : tab.title,
			});
			//sc.show();
		});
	});
	Ti.App.addEventListener('shortcutitemclick', function(e) {
		console.log('#########');
		console.log(e);
		$.setActiveTab(1);
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