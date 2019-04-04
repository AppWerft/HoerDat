const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0, STATUS_PROGRESS = 1, STATUS_SAVED = 2;
const TEMPLATES = [ 'pool_used', 'pool_saved', 'pool_online' ];
const HEADERLABELS = [ 'Begonnene Hörspiele',
		'Lokal verfügbare, bislang ungehörte Hörspiele',
		'Alle verfügbare Hörspiele vom Depot und vom Pool' ];
const Pool = require("controls/pool");
const ID3 = require("de.appwerft.mp3agic")

// https://jira.appcelerator.org/browse/AC-6128?focusedCommentId=445947&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-445947
function requestIgnoreBatteryOptimizations() {
	if (Ti.Platform.Android.API_LEVEL >= 23) {
		const intent = Ti.Android.createIntent({
			action : "android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
			data : "package:" + Ti.App.Android.launchIntent.packageName,
		});
		Ti.Android.currentActivity.startActivity(intent);
		Ti.App.Properties.setBool('IgnoreBatteryOptimizations', true);
	}
}

function getDataItems(state, position, ndx) {
	return Pool.getAll(state, position).map(function(item) {
		var duration = 'Dauer: ' + item.durationstring;
		if (item.position)
			duration += ' | gehört: ' + item.positionstring;
		return {

			properties : {
				accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
				searchableText : item.title + item.author + item.description,
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
				text : item.author
			},
			description : {
				text : item.description
			},
			logo : {
				image : item.image
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
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup
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
			color:'white',
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
			'pool_saved' : require('TEMPLATES').pool_saved,
			'pool_used' : require('TEMPLATES').pool_used,

		},
		defaultItemTemplate : 'pool_online',
		sections : HEADERLABELS.map(function(label) {
			return Ti.UI.createListSection({
				headerView : createHeaderView(label)
			});
		})
	});
	
	setSections();
	// https://github.com/prashantsaini1/scrollable_animation
	Pool.syncAll(setSections);
	$.add($.poolList);
	$.headerView= createHeaderView(HEADERLABELS[0]);	
	$.add($.headerView);
	$.poolList
			.addEventListener(
					'scrollend',
					function(e) {
						$.headerView.children[0].text = HEADERLABELS[e.firstVisibleSectionIndex];
					});
	$.poolList
			.addEventListener(
					'itemclick',
					function(e) {
						started = true;
						switch (e.sectionIndex) {
						case 2:
							Permissions
									.requestPermissions(
											[
													'REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
													'WRITE_EXTERNAL_STORAGE' ],
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
																							1,
																							0);
																		}
																	});
													if (res == true) {
														setSections();
														Ti.UI
																.createNotification(
																		{
																			message : "Dieses Stück wird jetzt im Hintergrund runtergeholt und ist alsbald verfügbar.\nFortschritt im Tray verfolgbar"
																		})
																.show();
													} else
														Ti.UI
																.createNotification(
																		{
																			message : "Dieses Stück ist schon offline verfügbar."
																		})
																.show();
												}
											});

							break;
						case 1:
						case 0:

							require("ui/common/podcast.window")(
									JSON.parse(e.itemId)).open();

							// _tabgroup.activity.startActivity(intent);
							break;
						}
					});
	function setSections() {
		const start = new Date().getTime();
		$.poolList.sections[0].items = getDataItems(STATUS_SAVED, true, 0);
		$.poolList.sections[1].items = getDataItems(STATUS_SAVED, false, 1);
		$.poolList.sections[2].items = getDataItems(STATUS_ONLINE, false, 2);
		console.log("setSections: " + (new Date().getTime() - start));
	}
	$.fabView = require('ui/common/fabview.widget')({
		onShow : function() {
			$.poolList.searchView = $.searchBar;
			$.searchBar.focus();
		},
		onHide : function() {
			console.log("hide Search");
			// $.poolList.searchView = null;
		}
	});
	$.add($.fabView);
	$.searchBar.addEventListener('change', $.fabView.onChange);
	if (started)
		$.addEventListener('focus', setSections);
	$.addEventListener('open', requestIgnoreBatteryOptimizations);
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
