module.exports = function(Window) {
	//create module instance
	var $ = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : false,
		swipeable : false

	});
	$.addEventListener('open', require('ui/common/main.menu'));
	var win1 = new Window('Heute, morgen …');
	require('ui/common/scheduler.window')(win1);
	var win2 = new Window('Suche');
	require('ui/common/search')(win2);
	$.addTab(Ti.UI.createTab({
		title : 'Hörplan',
		window : win1,
		ndx : 0
	}));
	
	$.addTab(Ti.UI.createTab({
		title : 'LiveRadio',
		
		window : require('ui/common/radiowheel.window')($),
		ndx : 1
	}));
	var tabindex = Ti.App.Properties.getInt('LASTTAB', 1);
	if (tabindex < $.tabs.length)
		$.setActiveTab(1);
	$.addEventListener("android:back", function(_e) {//listen for the back-button-tap event
		_e.cancelBubble = true;
		var intent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_MAIN,
			flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK
		});
		intent.addCategory(Ti.Android.CATEGORY_HOME);
		Ti.Android.currentActivity.startActivity(intent);
		return false;
	});
	$.getTabs().forEach(function(_tab) {
		_tab.addEventListener('selected', function(_e) {
			Ti.App.Properties.setInt('LASTTAB', $.getActiveTab().ndx);
		});
	});

	return $;
};

