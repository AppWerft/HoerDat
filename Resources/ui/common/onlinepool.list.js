const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0, STATUS_PROGRESS = 1, STATUS_SAVED = 2;
const TEMPLATES = [ 'pool_online' ];
const ABX = require('com.alcoapps.actionbarextras');

const Pool = require("controls/pool");

function getDataItems(state, position, ndx) {
	return Pool.getAll(state, position).map(
			function(item) {
				var duration = 'Dauer: ' + item.durationstring;
				if (item.position)
					duration += ' | gehört: ' + item.positionstring;
				return {
					properties : {
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
						searchableText : item.title + item.author
								+ item.description,
						itemId : JSON.stringify({
							url : item.url,
							title : item.title,
							cover : item.image,
							position : item.position,
							description : item.description,
							duration : item.duration
						})
					},
					searchableText : 'title',
					template : TEMPLATES[ndx],
					title : {
						text : item.title
					},
					cached : {
						opacity : item.cached ? 0.5 : 0
					},
					author : {
						text : item.author,
						height : item.author ? 20 : 0
					},
					description : {
						text : item.description ? item.description.substring(0,
								256) : ""
					},
					logo : {
						image : item.image.replace('jpeg?w=1800','jpeg?w=200')
					},
					duration : {
						text : duration
					}
				};
			});
};

module.exports = function(_tabgroup) {
	var started = false;
	// // START /////
	var $ = Ti.UI.createView({
		backgroundImage : '/images/bg.png',
	});
	$.searchBar = Ti.UI.createSearchBar({
		barColor : '#fff',
		showCancel : true,
		height : 45,
		color : 'black',
		hintText : 'Suchwort',
		top : 0,
	});
	$.searchBar.addEventListener('cancel', $.searchBar.blur);
	function createHeaderView(label) {
		const header = Ti.UI.createView({
			height : 25,
			top : 0,
			backgroundColor : '#3F79A9'
		});
		header.add(Ti.UI.createLabel({
			text : label,
			left : 10,
			color : 'white',
			font : {
				fontSize : 14,
				fontFamily : 'Rambla-Bold'
			},
			height : Ti.UI.FILL
		}));
		return header;
	}
	;
	$.poolList = Ti.UI.createListView({
		caseInsensitiveSearch : true,
		templates : {
			'pool_online' : require('TEMPLATES').pool_online,
		},
		defaultItemTemplate : 'pool_online',
		sections : [ Ti.UI.createListSection() ]
	});

	setSections();
	// https://github.com/prashantsaini1/scrollable_animation
	Pool.syncAll(setSections);
	$.add($.poolList);

	$.poolList
			.addEventListener(
					'itemclick',
					function(e) {
						started = true;
						Permissions
								.requestPermissions(
										[ 'WRITE_EXTERNAL_STORAGE' ],
										function(success) {
											if (success) {
												const url = JSON
														.parse(e.itemId).url, title = JSON
														.parse(e.itemId).title;
												if (!url)
													return;
												const res = Pool
														.downloadFile(
																url,
																title,
																function(e) {
																	if (e.success == true) {
																		setSections();
																		$.poolList
																				.scrollToItem(
																						0,
																						0);
																	}
																});
												if (res == true) {
													setSections();
													Ti.UI
															.createNotification(
																	{
																		message : "Dieses Stück wird jetzt im Hintergrund runtergeholt und ist alsbald verfügbar.\nFortschritt im Tray verfolgbar"
																	}).show();
												} else
													Ti.UI
															.createNotification(
																	{
																		message : "Dieses Stück ist schon offline verfügbar."
																	}).show();
											}
										});

					});
	function setSections() {
		const start = new Date().getTime();
		const newitems = getDataItems(STATUS_ONLINE, false, 2);
		if (newitems.length != $.poolList.sections[0].items.length)
			$.poolList.sections[0].items = newitems;
		console.log("setSections: " + (new Date().getTime() - start));
	}
	$.filterButton = require('ui/common/filterbutton.widget')({
		onShow : function() {
			$.poolList.searchView = $.searchBar;
			$.searchBar.focus();
		},
		onHide : function() {
			console.log("hide Search");
			// $.poolList.searchView = null;
		}
	});
	$.filterButton.bottom = 26;
	$.add($.filterButton);
	$.searchBar.addEventListener('change', $.filterButton.onChange);
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
