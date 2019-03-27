const FlipModule = require('de.manumaticx.androidflip');

module.exports = function(_tabgroup) {
    const $=Ti.UI.createWindow();
	var pages = [];
    for (var i = -1; i < 8; i++) {
        pages.push(require('ui/common/daylist')(i));
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
