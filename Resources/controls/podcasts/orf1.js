const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	const URL = "https://oe1.orf.at/podcast";
	var Doc = Soup.createDocument({
		url : URL,
		onload : function() {
			var podcasts = [];
			if (Doc) {
				Doc.select("#list .listItem").forEach(
						function(li) {
							podcasts.push({
								url : li.selectFirst('a').getAttribute('href'),
								image : 'https://oe1.orf.at'
										+ li.selectFirst('a img').getAttribute(
												'src'),
								title : li.selectFirst('.content h2').getText()
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