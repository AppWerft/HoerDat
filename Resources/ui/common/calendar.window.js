const FlipModule = require('de.manumaticx.androidflip');

module.exports = function(_tabgroup) {
    const $=Ti.UI.createWindow();
	var pages = [];
    for (var offs = -1; offs < 8; offs++) {
        pages.push(require('ui/common/calendar_daylist')(offs));
    }
    $.flipcontainer = FlipModule.createFlipView({
        orientation : FlipModule.ORIENTATION_HORIZONTAL,
        overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
        views : pages,
        currentPage : 1,
        
    });
    $.addEventListener('focus', function() {
        $.flipcontainer.peakNext(true);
    });
    $.add($.flipcontainer);
    return $;
};
