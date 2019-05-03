const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	const URL = "https://www.ndr.de/ndrkultur/service/Sendungen-von-NDR-Kultur-als-Podcast,ndr2234.html";
	var Doc = Soup.createDocument({
		url : URL,
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select(".teaser").forEach(
						function(li) {
							var img = li.selectFirst('.teaserimage img')
									.getAttribute('src');
							if (img.substr(0, 4) != 'http')
								img = 'https://www.ndr.de' + img;
							podcasts.push({
								// url :
								// li.selectFirst('a').getAttribute('href'),
								image : img,
								title : li.selectFirst('h2').getText(),
							// description:
							// li.selectFirst('.teasertext').toString(),
							});
						});
			}

			onload({
				items : podcasts,
				template : 'podcastslist_slim'
			});
		}
	});

};