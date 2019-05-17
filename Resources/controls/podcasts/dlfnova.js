const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	var Doc = Soup.createDocument({
		url : "https://www.deutschlandfunknova.de/podcasts",
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select(".coverList li.item").forEach(
						function(li) {

							podcasts.push({
								image : li.selectFirst('img').getAttribute(
										'src'),
								url : 'https://www.deutschlandfunknova.de'
										+ li.selectFirst('a').getAttribute(
												'href').replace(
												'podcasts/download', 'podcast')

							});

						});
			}
			// http://www.deutschlandfunknova.de/podcast/eine-stunde-medien
			console.log(podcasts);
			onload({
				items : podcasts,
				template : 'podcastslist_pictonly'
			});
		}
	});

};