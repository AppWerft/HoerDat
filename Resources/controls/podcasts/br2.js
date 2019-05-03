const Soup = require("de.appwerft.soup");
module.exports = function(onload) {


var Doc = Soup.createDocument({
		url : "https://www.br.de/mediathek/podcast/sender/bayern-2",
		onload : function() {
			var podcasts = [];
			
			if (Doc) {
				Doc.select(".podcasts-group").forEach(function(li) {
					const img = li.selectFirst('noscript');
					const noscript = li.selectFirst('.text__headline');
					podcasts.push({
						image : li.selectFirst('.v-lazy-image').getAttribute('src'),
						title : 	li.selectFirst('.main-title').getText(),
						description: li.selectFirst('.podcast-summary').getText()
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