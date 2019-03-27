const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;
const VisualizerModule = require('ti.audiovisualizerview');

module.exports = function(_tabgroup) {
	const Pool = require("controls/pool");
	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup
	});

	// https://github.com/prashantsaini1/scrollable_animation
	Pool.syncAll();

	$.poolList = Ti.UI.createListView({
		templates : {
			'pool' : require('TEMPLATES').pool,
		},
		defaultItemTemplate : 'pool',
		sections : [ Ti.UI.createListSection({
			items : Pool.getAll().map(function(item) {
				return {
					properties : {
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
						itemId : JSON.stringify({
							url : item.url,
							title : item.title
						})
					},
					title : {
						text : item.title
					},
					author : {
						text : item.author
					},
					description : {
						text : item.description
					},
					logo : {
						image : item.image
					},
					duration : {
						text : 'Dauer: ' + item.min + ' min.'
					}
				};
			})
		}) ]
	});
	$.add($.poolList);
	$.poolList.addEventListener('itemclick', function(e) {
		Pool.downloadFile(JSON.parse(e.itemId).url,JSON.parse(e.itemId).title,function(e){
			console.log(e);
		});
		return;
		var intent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_VIEW,
			data : JSON.parse(e.itemId).url,
			type : "audio/*"
		});
		intent.putExtra(Ti.Android.EXTRA_TITLE, JSON.parse(e.itemId).title);
		//_tabgroup.activity.startActivity(intent);
	});
	return $;
};
// https://github.com/kgividen/TiCircularSliderBtnWidget
