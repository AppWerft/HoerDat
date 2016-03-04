module.exports = function(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : false,
		swipeable : false

	});
	self.addEventListener('open', require('ui/common/main.menu'));
	var win1 = new Window('Heute, morgen …');
	require('ui/common/scheduler.window')(win1);
	var win2 = new Window('Suche');
	require('ui/common/search')(win2);
	self.addTab(Ti.UI.createTab({
		title : 'Hörplan',
		window : win1,
		ndx : 0
	}));
	
	self.addTab(Ti.UI.createTab({
		title : 'LiveRadio',
		window : require('ui/common/radiowheel.window')(),
		ndx : 2
	}));
	var tabindex = Ti.App.Properties.getInt('LASTTAB', 1);
	if (tabindex < self.tabs.length)
		self.setActiveTab(1);
	self.addEventListener("android:back", function(_e) {//listen for the back-button-tap event
		_e.cancelBubble = true;
		var intent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_MAIN,
			flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK
		});
		intent.addCategory(Ti.Android.CATEGORY_HOME);
		Ti.Android.currentActivity.startActivity(intent);
		return false;
	});
	self.getTabs().forEach(function(_tab) {
		_tab.addEventListener('selected', function(_e) {
			Ti.App.Properties.setInt('LASTTAB', self.getActiveTab().ndx);
		});
	});

	return self;
};

