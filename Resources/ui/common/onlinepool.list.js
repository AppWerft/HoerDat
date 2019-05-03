const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0, STATUS_PROGRESS = 1, STATUS_SAVED = 2;
const TEMPLATES = [ 'pool_online' ];
const Pool = require("controls/pool");
const ProgressBar = require("com.artanisdesign.tismoothprogressbar");

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
						text : item.description ? item.description : ""
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

module.exports = function(_lcc) {
	function setSections() {
		$.progressBar.height = 5;
		$.poolList.top=5;
		const start = new Date().getTime();
		const newitems = getDataItems(STATUS_ONLINE, false, 2);
		if (newitems&& newitems.lenght != $.poolList.sections[0].items.length) {
			$.poolList.sections[0].items = newitems;
			$.progressBar.height = 0;
			$.poolList.top=0;
		}
	}
	const $ = Ti.UI.createView({
		backgroundImage : '/images/bg.png'
	});
	$.progressBar = ProgressBar.createSmoothProgressBar({
		height : 5,
		zIndex : 1111,
		backgroundColor : 'white',
		top : 0,
		width : Ti.UI.FILL,
		color : "#225588", // color of the bar
		sectionsCount : 6, // default
		separatorLength : 8, // default 8,
		strokeWidth : 50, // default 10
		speed : 1.0, // default 1.0
		reversed : false, // default false
		mirrorMode : true, // default false
		interpolator : ProgressBar.ACCELERATE
	});
	$.searchBar = Ti.UI.createSearchBar({
		barColor : '#fff',
		showCancel : true,
		height : 45,
		color : 'black',
		hintText : 'Suchwort',
		top : 0,
	});
	$.add($.progressBar);
	// $.add($.searchBar);
	$.searchBar.addEventListener('cancel', $.searchBar.blur);
	$.poolList = Ti.UI.createListView({
		top : 5,
		caseInsensitiveSearch : true,
		templates : {
			'pool_online' : require('TEMPLATES').pool_online,
		},
		defaultItemTemplate : 'pool_online',
		sections : [ Ti.UI.createListSection() ]
	});

	setSections();
	// https://github.com/prashantsaini1/scrollable_animation
	
	$.progressBar.height = 5;
	Pool.syncWithRSS(setSections);
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
												Pool.downloadFile(url,title);
													setSections();
													Ti.UI.createNotification(
																	{
																		message : "Dieses Stück wird jetzt im Hintergrund runtergeholt und ist alsbald verfügbar.\nFortschritt im Tray verfolgbar"
																	}).show();
												
											}
										});

					});

	$.filterButton = require('ui/common/filterbutton.widget')({
		onShow : function() {
			$.poolList.searchView = $.searchBar;
			$.searchBar.focus();
		},
		onHide : function() {
			console.log("hide Search");
		}
	});
	$.filterButton.bottom = 26;
	$.add($.filterButton);
	$.searchBar.addEventListener('change', $.filterButton.onChange);
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
