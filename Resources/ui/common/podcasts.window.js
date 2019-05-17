const FlipModule = require('de.manumaticx.androidflip');
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;
const stations = [ 'dlf','dlr','dlfnova', 'wdr'];
// https://www1.wdr.de/mediathek/podcast/index.html

module.exports = function(_tabgroup) {
	function setState() {
		$.naviView.children.forEach(function(v, i) {
			v.opacity = i == currentPageindex ? 1 : 0.9;
			v.top = i == currentPageindex ? 5 : 0;
		});
		$.naviView.contentOffset = {
			y : 0,
			x : parseInt(100 * currentPageindex  + 50)
		};
	}
	var currentPageindex = 0;
	const $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
	});
	$.naviView = Ti.UI.createScrollView({
		top : 0,
		height : 110,
		zIndex : 99,
		scrollType : 'horizontal',
		layout : 'horizontal',
	});
	$.add($.naviView);
	$.naviView
			.addEventListener(
					'click',
					function(e) {
						if (e.source.itemId != undefined) {
							currentPageindex = e.source.itemId;
							setState();
							$.flipcontainer
									.flipToView($.flipcontainer.views[currentPageindex]);
						}
					});
	stations.forEach(function(s, i) {
		$.naviView.add(Ti.UI.createImageView({
			image : '/images/podcasts/' + s + '.png',
			left : i ? 0 : SCREENWIDTH/2,
			right : i == stations.length - 1 ? SCREENWIDTH/2 : 0,
			height : 100,
			itemId : i,
			width : '100'
		}));
	});
	$.flipcontainer = FlipModule.createFlipView({
		top : 100,
		orientation : FlipModule.ORIENTATION_HORIZONTAL,
		overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
		views : stations.map(require('ui/common/podcasts.list')),
		currentPage : 1,

	});
	$.flipcontainer.addEventListener('flipped', function(e) {
		currentPageindex = e.index;
		setState();
	});
	$.addEventListener('focus', function() {
		$.flipcontainer.peakNext(true);
	});
	$.add($.flipcontainer);
	setState();
	
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
