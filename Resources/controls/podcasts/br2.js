const Soup = require("de.appwerft.soup");
module.exports = function(onload) {


var Doc = Soup.createDocument({
		url : "https://www.br.de/mediathek/podcast/sender/bayern-2",
		onload : function() {
			var podcasts = [];
			
			if (Doc) {
				Doc.select("article").forEach(function(li) {
					const img = li.selectFirst('noscript img');
					console.log(img);
					podcasts.push({
						image : img.getAttribute('src'),
						title : 	li.selectFirst('.text__headline').getText(),
						
				});
					
				});
			}
			podcasts.pop();
			podcasts.shift();
			
			onload({
				items : podcasts,
				template : 'podcastslist'
			});
		}
	});

	

};