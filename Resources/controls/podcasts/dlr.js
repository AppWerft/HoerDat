const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	const URL = "https://www.deutschlandfunkkultur.de/podcasts.2502.de.html?drpp:hash=displayAllBroadcasts";
	var Doc = Soup.createDocument({
		url : URL,
		onload : function() {
			var podcasts = [];
			if (Doc) {
				var podcastlist = Doc.select(".drk-podcastlist li");
				if (!podcastlist) {
					console.log("no podcastlist for dlr");
					return;
				}
			
				podcastlist && podcastlist.forEach(function(li) {
					var aa =  li.select('.podcastinfo a');
					podcasts.push({
						url : aa ? aa[aa.length-1].getAttribute('href'): null,
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