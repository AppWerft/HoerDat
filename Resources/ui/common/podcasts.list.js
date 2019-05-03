module.exports = function(id) {
	function onLoad(payload) {
		$.sections[0].items = payload.items.map(function(item){
			return {
				properties : {
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
					
				},
				template : payload.template,
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
	require('controls/podcasts/'+id)(onLoad);

	return $;

};