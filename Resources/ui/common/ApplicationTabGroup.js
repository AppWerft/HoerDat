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
	self.addTab(Ti.UI.createTab({
		title : 'Hörplan',
		window : win1,
		ndx : 0
	}));
	self.addTab(Ti.UI.createTab({
		title : 'Suche',
		window : win2,
		ndx : 1
	}));
	
	console.log('Permissions ======================================');
	require('ti.permissions').requestPermissions(['android.permission.READ_PHONE_STATE'], function(e) {
		console.log('Permissions -----');
		console.log(e);
		
		self.open();
		if (e.success) {
			console.log('Permissions  >>>>>>>>>>>>>>>>>>>>');
			self.addTab(Ti.UI.createTab({
				title : 'LiveRadio',
				window : require('ui/common/radio.window')(),
				ndx : 2
			}));
			var tabindex = Ti.App.Properties.getInt('LASTTAB', 2);
			if (tabindex < self.tabs.length)
				self.setActiveTab(tabindex);
		} else {
			console.log('Permissions A<<<<<<<<<<<<<<<<<<');
			Ti.UI.createNotification({
				duration : 5000,
				message : 'Die LiveRadio-Funktion braucht Zugriff auf den Telefonstatus um das Radio bei ankommenden Telefonat stummzuschalten.'
			}).show();
			}
			
	}, 0);

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

