const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	const URL = "https://www.deutschlandfunk.de/podcasts.2516.de.mhtml?drpp:hash=displayAllBroadcasts";
	var Doc = Soup.createDocument({
		url : URL,
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select("ul.dlf-podcastlist li").forEach(function(li) {
					podcasts.push({
						url : li.selectFirst('.podcastlink a').getAttribute('href'),
						image : li.selectFirst('.thumbnail img').getAttribute('src'),
						title : li.selectFirst('.podcastinfo strong').getText()
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