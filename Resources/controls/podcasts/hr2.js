const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	var Doc = Soup.createDocument({
		url : "https://www.hr2.de/programm/podcasts/index.html",
		onload : function() {
			var podcasts = [];
			if (Doc) { 
				console.log(Doc.toString());
				const main = Doc.selectFirst("main#content");
				console.log(main.toString());
				return;
				sections[1].select("article.c-teaser").forEach(function(li) {
					console.log(li.toString());
					
						var img = li.selectFirst('noscript').getAttribute('src');
						var headline= li.selectFirst('text__headline').getText().getText();
						podcasts.push({
							image : img,
							title : headline	
							
						});
					
				});
			}
			console.log(podcasts);
			onload({
				items : podcasts,
				template : 'podcastslist_slim'
			});
		}
	});

};