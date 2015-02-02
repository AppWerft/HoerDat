var xhr = require('superagent');

module.exports = function(args) {
	console.log(args.url);
	xhr.get(args.url).end(function(foo) {
		console.log(foo);

		var bar;
		try {
			console.log(foo);
			if (foo.ok) {
				if (foo.body.substr(0, 5) == '<?xml') {
					var bar = new (require('vendor/XMLTools'))(res.body).getObject();
				} else {
					bar = JSON.parse(foo.body);

				}
				args.onload(bar);
			}
		} catch(E) {
			console.log(E);
		}
	});
};
