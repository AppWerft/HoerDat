const FlipModule = require('de.manumaticx.androidflip');

module.exports = function(_tabgroup) {
	const $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png'
	});
	$.addEventListener('focus', function() {
		console.log("Window calendar FOCUS");
	});
	$.addEventListener('open', () => {
		if ($.children && $.children.length) return;
		console.log("Window calendar OPEN");
		var pages = [];
		for (var offs = -1; offs < 8; offs++) {
			pages.push(require('ui/common/calendar.daylist')(offs));
		}
		$.DrawerLayout = Ti.UI.Android.createDrawerLayout({
			leftView : require('ui/common/calendar.drawer')(),
			centerView : FlipModule.createFlipView({
				orientation : FlipModule.ORIENTATION_HORIZONTAL,
				overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
				views : pages,
				currentPage : 1,
			})
		});
		$.DrawerLayout.addEventListener('open', $.DrawerLayout.leftView.updateContent);
		$.addEventListener('focus', function() {
			$.DrawerLayout.centerView.peakNext(true);
		});
		$.add($.DrawerLayout);
	});
	return $;
};
