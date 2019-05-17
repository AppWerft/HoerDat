const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	var Doc = Soup
			.createDocument({
				url : "https://www.srf.ch/podcasts",
				onload : function() {
					var podcasts = [];
					if (Doc) {
						Doc
								.select("ul.unstyled li.shows")
								.forEach(
										function(li, i) {
											const imgNode = li
													.selectFirst('.icon-container img');
											if (imgNode) {
												var img = imgNode
														.getAttribute('data-retina-src');
												if (!img)
													return;
												img = img.replace(
														'scale/width/1248',
														'scale/width/400');

												const data = li
														.selectFirst('.podcast-data');
												if (data
														.getAttribute('data-show-type') == 'radio') {
													podcasts
															.push({
																image : img,
																url : data
																		.getAttribute('data-url'),
																title : li
																		.selectFirst(
																				'h3 a')
																		.getText()
															});
												}
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