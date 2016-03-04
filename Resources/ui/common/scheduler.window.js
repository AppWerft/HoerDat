module.exports = function(window) {
    var pages = [];
    for (var i = -1; i < 8; i++) {
        pages.push(require('ui/common/daylist')(i));
    }
    var FlipModule = require('de.manumaticx.androidflip');
    window.flipcontainer = FlipModule.createFlipView({
        orientation : FlipModule.ORIENTATION_HORIZONTAL,
        overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
        views : pages,
        currentPage : 1,
        height : Ti.UI.FILL
    });
//    window.flipcontainer.flipToView();
    window.addEventListener('focus', function() {
        window.flipcontainer.peakNext(true);
    });
    window.add(window.flipcontainer);
};
