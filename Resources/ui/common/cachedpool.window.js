const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0,
    STATUS_PROGRESS = 1,
    STATUS_SAVED = 2;
const TEMPLATES = ['pool_progress', 'pool_used', 'pool_saved'];
const HEADERLABELS = ['Hörspiele im Download', 'Begonnene Hörspiele', 'Lokal verfügbare, bislang ungehörte Hörspiele'];
const STATHEIGHT = 10;
const Pool = require("controls/pool");

function getDataItems(state, position, ndx) {
	return Pool.getAll(state, position).map(function(item) {
		var duration = 'Dauer: ' + item.durationstring;
		if (item.position)
			duration += ' | gehört: ' + item.positionstring;
		return {
			properties : {
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
			ani : {
				file : '/images/cup.json',
				opacity : 0
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
				image : item.image.replace('jpeg?w=1800', 'jpeg?w=200')
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
	/*$.searchBar = Ti.UI.createSearchBar({
	 barColor : '#fff',
	 showCancel : true,
	 height : 45,
	 color : 'black',
	 hintText : 'Suchwort',
	 top : 0,
	 });
	 $.searchBar.addEventListener('cancel', $.searchBar.blur);*/
	$.statisticView = require('ui/common/statisticview')(STATHEIGHT);
	const HEIGHT_OF_HANDLER_SHORT = 80,
	    HEIGHT_OF_HANDLER_LONG = 300;
	$.swipeHandler = Ti.UI.createView({
		top : 0,
		height : HEIGHT_OF_HANDLER_SHORT,
		zIndex : 999
	});
	/*$.swipeHandler.addEventListener('swipe', function(e) {
		if (e.direction == 'down') {
			$.swipeHandler.height = HEIGHT_OF_HANDLER_LONG;
			$.container.animate({
				top : 400
			});
		} else {
			$.container.animate({
				top : STATHEIGHT
			});
			$.swipeHandler.height = HEIGHT_OF_HANDLER_SHORT;
		}
	});*/
	//$.add($.statisticView);
	$.add($.swipeHandler);
	$.container = Ti.UI.createView({
		backgroundColor : 'white'
	});
	$.drawer = Ti.UI.Android.createDrawerLayout({
		leftView : $.statisticView,
		centerView : $.container,
	});
	Ti.App.addEventListener("app:toggleleft",function(){
		$.drawer.toggleLeft();
	});
	$.add($.drawer);
	//$.add($.container);
	// {"files":10,"externalTotal":5951,"externalFree":2319,"bytesconsumed":486}
	$.poolList = Ti.UI.createListView({
		top : 0,
		caseInsensitiveSearch : true,
		templates : {
			'pool_saved' : require('TEMPLATES').pool_saved,
			'pool_used' : require('TEMPLATES').pool_used,
			'pool_progress' : require('TEMPLATES').pool_progress,

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
	$.poolList.addEventListener('scrollend', function(e) {
		$.headerView.children[0].text = HEADERLABELS[e.firstVisibleSectionIndex];
	});
	$.poolList.addEventListener('itemclick', function(e) {
		if (e.sectionIndex != 0) {
			const start = new Date().getTime();
			const win = require("ui/common/hoerspiel.window")(JSON.parse(e.itemId), renderSections);
			console.log("Runtime Window: " + (new Date().getTime() - start));
			win.open();
		}
	});
	function renderSections() {
		$.statisticView.renderView();
		const start = new Date().getTime();
		$.poolList.sections[0].items = getDataItems(STATUS_PROGRESS, false, 0);
		$.poolList.sections[1].items = getDataItems(STATUS_SAVED, true, 1);
		$.poolList.sections[2].items = getDataItems(STATUS_SAVED, false, 2);
		if ($.poolList.sections[1].items.length > 0 || $.poolList.sections[0].items.length > 0)
			$.add($.filterButton);
		console.log("renderSections: " + (new Date().getTime() - start));
	}

	/*$.filterButton = require('ui/common/filterbutton.widget')({
	 onShow : function() {
	 $.poolList.searchView = $.searchBar;
	 $.searchBar.focus();
	 },
	 onHide : function() {
	 console.log("hide Search");
	 // $.poolList.searchView = null;
	 }
	 });*/

	$.addButton = require('ui/common/addbutton.widget')({
		onClick : function() {
			require('ui/common/onlinepool.window')(_tabgroup, renderSections).open();

		}
	});
	$.add($.addButton);
	//$.searchBar.addEventListener('change', $.filterButton.onChange);

	// $.addEventListener('focus', renderSections);
	// $.addEventListener('open',
	// require('vendor/requestignorebatteryoptimizations'));
	Ti.App.addEventListener('downloadmanager:onComplete', function() {
		Ti.UI.createNotification({
			message : "Runterladen war erfolgreich.\n"
		}).show();
		renderSections();
	});
	Ti.App.addEventListener('renderPool', renderSections);
	/* inital fill: */
	renderSections();
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
