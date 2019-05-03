const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	var Doc = Soup.createDocument({
		url : "https://www.deutschlandfunknova.de/podcasts",
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select(".coverList li.item").forEach(function(li) {

					podcasts.push({
						image : li.selectFirst('img').getAttribute('src')

					});

				});
			}
			onload({
				items : podcasts,
				template : 'podcastslist_pictonly'
			});
		}
	});

};