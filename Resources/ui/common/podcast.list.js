const TEMPLATES = [ 'pool_online' ];
const Podcasts = require("controls/podcastchannels");
const ProgressBar = require("com.artanisdesign.tismoothprogressbar");

function getDataItems(channelurl, onLoad) {
	return Podcasts.getChannelByUrl(channelurl, function(channel) {
		const items = channel.item;
		console.log(":::::::::::: getDataItems");
		onLoad(items.map(function(item) {
			var duration = 'Dauer: ' + item.durationstring;
			if (item.position)
				duration += ' | gehört: ' + item.positionstring;
			return {
				properties : {
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
					searchableText : item.title + item.author
							+ item.description,
					itemId : 
						item.url
						
				},
				searchableText : 'title',

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
		}));
	});
};

module.exports = function(channelurl) {

	function setSections() {
		$.progressBar.height = 5;
		$.podcastList.top = 5;
		const start = new Date().getTime();
		getDataItems(
				channelurl,
				function(dataitems) {

					if (dataitems
							&& dataitems.lenght != $.podcastList.sections[0].items.length) {
						$.podcastList.sections[0].items = dataitems;
						$.progressBar.height = 0;
						$.podcastList.top = 0;
					}
				});
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
	$.podcastList = Ti.UI.createListView({
		top : 5,
		caseInsensitiveSearch : true,
		templates : {
			'channellist' : require('TEMPLATES').channellist,
		},
		defaultItemTemplate : 'channellist',
		sections : [ Ti.UI.createListSection() ]
	});

	setSections();
	// https://github.com/prashantsaini1/scrollable_animation

	$.progressBar.height = 5;

	$.add($.podcastList);
	return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
