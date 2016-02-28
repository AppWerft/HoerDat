module.exports = function(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : false,
		swipeable : false
		
	});
	self.addEventListener('open', require('ui/common/main.menu'));
	var win1 = new Window('Heute, morgen …');
	require('ui/common/scheduler')(win1);
	var win2 = new Window('Suche');
	require('ui/common/search')(win2);
	var win3 = require('ui/common/radio.window')();
	var tab1 = Ti.UI.createTab({
		title : 'Hörplan',
		window : win1,
		ndx : 0

	});
	var tab2 = Ti.UI.createTab({
		title : 'Suche',
		window : win2,
		ndx : 1

	});
	var tab3 = Ti.UI.createTab({
		title : 'LiveRadio',
		window : win3,
		ndx : 2

	});
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addEventListener('click', function(_e) {
		Ti.App.Properties.setInt('LASTTAB', _e.source.ndx);
	});
	self.setActiveTab(Ti.App.Properties.getInt('LASTTAB', 0));
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
	return self;
};

