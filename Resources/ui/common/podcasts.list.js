const PodcastChannels = require('controls/podcastchannels');

module.exports = function(station) {
	function onLoad(items) {
		$.sections[0].items = items.map(function(item){
			return {
				properties : {
					accessoryType : item.url ?Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE: undefined,
					itemId : item.url? item.url:null
				},
				template : item.template,
				title : {
					text : item.title
				},
				logo : {
					image : item.image 
				}
			};
		});
	}
	const $ = Ti.UI.createListView({
		templates : {
			'podcastslist' : require('TEMPLATES').podcastslist,
			'podcastslist_slim' : require('TEMPLATES').podcastslist_slim,
			'podcastslist_pictonly' : require('TEMPLATES').podcastslist_pictonly,
		},
		defaultItemTemplate : 'podcastslist',
		sections : [ Ti.UI.createListSection() ]
	});
	PodcastChannels.getChannelsByStation(station, onLoad);

	$.addEventListener('itemclick',function(e){
		require('ui/common/podcast.window')(e.itemId).open();
	});
	return $;

};