const tabData = require('model/tabgroup');
var start = new Date().getTime();
function Log(foo) {
	console.log('::::::: ' + (new Date().getTime() - start) + '   ' + foo);
	start = new Date().getTime();
}

Log("Appstart");
module.exports = function() {
	Log("Start TabGroup");
	const $ = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : true,
		tabsBackgroundColor : '#88225588',
		swipeable : false,
		barColor : 'white',
		tabsBackgroundSelectedColor : '#883377aa',
		style : Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	Log("Tabgroup created");
	

	Log("Tabgroup data set");

	$.addEventListener('close', function() {
		Ti.App.fireEvent('stopRadio');
	});
	$.addEventListener('open', function(open) {
		require('ui/common/main.menu')(open);
		
	});

	Log("Listener started, start opening");
	$.open();

	tabData.forEach( (d) => {
		$.addTab(Ti.UI.createTab({
			title : d.title,
			icon : d.icon,
			window : require(d.window)($)
		}));
	});
	const activeTabIndex = Ti.App.Properties.getInt("ACTIVE_TAB", 1);
	$.setActiveTab(activeTabIndex);
	Log("Setting activeTabIndex: " + activeTabIndex);
	setTimeout(function(){$.addEventListener('focus', function(focus) {
			Log("TABGROUP catched FOCUS " + focus.index)
			Ti.App.Properties.setInt('ACTIVE_TAB', focus.index);
		});},1500)
	Log("opened");
};
/*
 * var intent = Ti.Android.createIntent({ action : Ti.Android.ACTION_MAIN, flags :
 * Ti.Android.FLAG_ACTIVITY_NEW_TASK });
 * intent.addCategory(Ti.Android.CATEGORY_HOME);
 * Ti.Android.currentActivity.startActivity(intent);
 */