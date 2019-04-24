// https://jira.appcelerator.org/browse/AC-6128?focusedCommentId=445947&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-445947
module.exports = function requestIgnoreBatteryOptimizations() {
	if (Ti.Platform.Android.API_LEVEL >= 23) {
		const intent = Ti.Android.createIntent({
			action : "android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
			data : "package:" + Ti.App.Android.launchIntent.packageName,
		});
		Ti.Android.currentActivity.startActivity(intent);
		Ti.App.Properties.setBool('IgnoreBatteryOptimizations', true);
	}
};
