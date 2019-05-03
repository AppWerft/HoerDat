const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	const URL = "https://www1.wdr.de/mediathek/podcast/index.html";

	var Doc = Soup.createDocument({
		url : URL,
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select("ul.list li").forEach(function(li) {

					podcasts.push({
						url : li.selectFirst('a').getAttribute('href'),
						image : '/images/podcasts/wdr.png',
						title : li.selectFirst('strong').getText()
					});
				});
			}
			onload({
				items : podcasts,
				template : 'podcastslist'
			});
		}
	});

};