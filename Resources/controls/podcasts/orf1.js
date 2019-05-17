const Soup = require("de.appwerft.soup");
module.exports = function(onload) {
	const URL = "https://oe1.orf.at/podcast";
	const podcasts = [
			{
				title : '#doublecheck',
				url : '',
				image : 'https://oe1.orf.at/i/intro/13/90/13904e506d058b34d28321b0999855c7ddedcbba.jpg'
			}, {
				title : '',
				url : '',
				image : ''
			} ];

	onload({
		items : podcasts,
		template : 'podcastslist'

	});
};