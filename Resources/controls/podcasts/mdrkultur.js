const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	var Doc = Soup.createDocument({
		url : "https://www.mdr.de/kultur/radio/podcasts-uebersicht-100.html",
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select(".innerTeaser").forEach(function(li) {
					
					var img = li.selectFirst('noscript img');
					if (!img) return;
					const headline = li.selectFirst('.headline');
					
					if (!!img && !!headline) {
						img=img.getAttribute('src');
						if (img.substr(0, 4) != 'http')
							img = 'https://www.mdr.de' + img;
						
						podcasts.push({
							image : img,
							title : headline	.getText(),
							//description: li.selectFirst('.teasertext a').getText()
						});
					}
				});
			}
			podcasts.pop();
			podcasts.shift();
			onload({
				items : podcasts,
				template : 'podcastslist_slim'
			});
		}
	});

};