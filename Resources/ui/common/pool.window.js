const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0, STATUS_PROGRESS = 1, STATUS_OFFLINE = 2;
const Pool = require("controls/pool");
const ID3 = require("de.appwerft.mp3agic")

function getItems(state) {
	return Pool.getAll(state).map(
			function(item) {
				var duration = 'Dauer: ' + item.durationstring;
				if (item.position)
					duration += ' | gehört: ' + item.positionstring;
				return {
					searchableText : 'title',
					properties : {
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
						searchableText : 'title',
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
					template : (state == STATUS_OFFLINE) ? 'pool_offline'
							: 'pool_online',
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

	// // START /////
	var $ = Ti.UI.createWindow({
		backgroundImage : '/images/bg.png',
		tabgroup : _tabgroup
	});
	$.searchBar = Titanium.UI.createSearchBar({
		barColor : '#fff',
		showCancel : true,
		height : 45,
		color : 'black',
		hintText : 'Suchwort',
		top : 0,
	});
	$.searchBar.addEventListener('cancel', function(){
	    search.blur();
	});
	$.searchBar.addEventListener('change', function(e	) {
		//$.poolList.searchText = e.value;
	});
	$.poolList = Ti.UI.createListView({
		top : 45,
		caseInsensitiveSearch : true,
		searchView: $.searchBar,
		templates : {
			'pool_online' : require('TEMPLATES').pool_online,
			'pool_offline' : require('TEMPLATES').pool_offline,
		},
		defaultItemTemplate : 'pool_online',
		sections : [ Ti.UI.createListSection({
			headerTitle : 'Lokal verfügbare Hörspiele',
			items : getItems(STATUS_OFFLINE)
		}), Ti.UI.createListSection({
			headerTitle : 'Alle verfügbare Hörspiele vom Depot und vom Pool',
			items : getItems(STATUS_ONLINE)
		}) ]
	});
	// https://github.com/prashantsaini1/scrollable_animation
	Pool.syncAll(function() {
		$.poolList.sections[0].items = getItems(STATUS_OFFLINE);
		$.poolList.sections[1].items = getItems(STATUS_ONLINE);

	});
	$.add($.searchBar);
	$.add($.poolList);

	$.poolList
			.addEventListener(
					'itemclick',
					function(e) {
						switch (e.sectionIndex) {
						case 1:
							Permissions
									.requestPermissions(
											'WRITE_EXTERNAL_STORAGE',
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
																			$.poolList.sections[0].items = getItems(STATUS_OFFLINE);
																			$.poolList
																					.scrollToItem(
																							0,
																							0);
																		}
																	});
													if (res == true) {
														$.poolList.sections[1].items = getItems(STATUS_ONLINE);
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
						case 0:

							require("ui/common/podcast.window")(
									JSON.parse(e.itemId)).open();

							// _tabgroup.activity.startActivity(intent);
							break;
						}
					});
	$.addEventListener('focus', function() {
		$.poolList.sections[0].items = getItems(STATUS_OFFLINE);
	});
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
