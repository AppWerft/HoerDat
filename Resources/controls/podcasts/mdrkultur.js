const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	var Doc = Soup.createDocument({
		url : "https://www.mdr.de/kultur/radio/podcasts-uebersicht-100.html",
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select(".teaser").forEach(function(li) {
					
					const noscript = li.selectFirst('noscript');
					const headline = li.selectFirst('.headline');
					
					if (!!noscript && !!headline) {
						var img = noscript.getAttribute('src');
						
						if (img.substr(0, 4) != 'http')
							img = 'https://www.mdr.de' + img;
						console.log(img);
						podcasts.push({
							image : img,
							title : headline	.getText(),
							//description: li.selectFirst('.teasertext a').getText()
						});
					}
				});
			}
			onload({
				items : podcasts,
				template : 'podcastslist_slim'
			});
		}
	});

};