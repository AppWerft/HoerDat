const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0, STATUS_PROGRESS = 1, STATUS_SAVED = 2;
const TEMPLATES = [ 'pool_used', 'pool_saved' ];
const HEADERLABELS = [ 'Begonnene Hörspiele',

'Lokal verfügbare, bislang ungehörte Hörspiele' ];
const STATHEIGHT = 10;
const Pool = require("controls/pool");
const ID3 = require("de.appwerft.mp3agic")

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
					id : item.id,
					url : item.url,
					title : item.title,
					cover : item.image,
					author : item.author,
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

/* START */
module.exports = function(_tabgroup) {
	var started = false;
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
	$.statisticView = require('ui/common/statisticview')(STATHEIGHT);
	$.statisticView.onSwipe = function(e) {
		$.container.animate({
			top : e.direction == 'down' ? 400 : STATHEIGHT
		});
	};
	$.add($.statisticView);
	$.container = Ti.UI.createView({
		top : STATHEIGHT,
		backgroundColor : 'white'
	});
	$.add($.container);
	// {"files":10,"externalTotal":5951,"externalFree":2319,"bytesconsumed":486}
	$.poolList = Ti.UI.createListView({
		top : 0,
		caseInsensitiveSearch : true,
		templates : {
			'pool_saved' : require('TEMPLATES').pool_saved,
			'pool_used' : require('TEMPLATES').pool_used,

		},
		defaultItemTemplate : 'pool_saved',
		sections : HEADERLABELS.map(function(label) {
			return Ti.UI.createListSection({
				headerView : require('ui/common/headerview.widget')(label)
			});
		})
	});
	// https://github.com/prashantsaini1/scrollable_animation
	$.container.add($.poolList);
	$.headerView = require('ui/common/headerview.widget')(HEADERLABELS[0]);
	$.headerView.top = 0;
	$.container.add($.headerView);
	$.poolList
			.addEventListener(
					'scrollend',
					function(e) {
						$.headerView.children[0].text = HEADERLABELS[e.firstVisibleSectionIndex];
					});
	$.poolList.addEventListener('itemclick', function(e) {
		started = true;
		require("ui/common/podcast.window")(JSON.parse(e.itemId)).open();

		// _tabgroup.activity.startActivity(intent);

	});
	function renderSections() {
		$.statisticView.renderView();
		const start = new Date().getTime();

		$.poolList.sections[0].items = getDataItems(STATUS_SAVED, true, 0);
		$.poolList.sections[1].items = getDataItems(STATUS_SAVED, false, 1);
		if (Pool.getAllTotal(STATUS_SAVED, false) > 0)
			$.add($.filterButton);
		console.log("renderSections: " + (new Date().getTime() - start));
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

	$.addButton = require('ui/common/addbutton.widget')({
		onClick : function() {
			require('ui/common/onlinepool.window')().open();

		}
	});
	$.add($.addButton);
	$.searchBar.addEventListener('change', $.filterButton.onChange);

	$.addEventListener('focus', renderSections);
	$.addEventListener('open',
			require('vendor/requestignorebatteryoptimizations'));
	Ti.App.addEventListener('download::ready', function() {
		Ti.UI.createNotification({
			message : "Runterladen war erfolgreich.\n"
		}).show();
		renderSections();
	});
	Ti.App.addEventListener('renderPool', renderSections);
	renderSections();
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
