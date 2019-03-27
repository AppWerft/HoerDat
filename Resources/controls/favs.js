const RADIOSTATIONS = require('model/radiostations');
const DB = 'RadioRecentLog';
var link = Ti.Database.open(DB);
link
		.execute('CREATE TABLE IF NOT EXISTS "fav" ("station" VARCHAR, "total" INTEGER);');
link.close();

exports.getAll = function() {
	var radiostations = JSON.parse(JSON.stringify(RADIOSTATIONS));
	radiostations.forEach(function(s) {
		s.total = 0;
	});
	const link = Ti.Database.open(DB);
	link.execute('update fav set total=total*0.99'); // oldering
	const favs = link.execute('select * from fav');
	while (favs.isValidRow()) {
		radiostations.forEach(function(s) {
			if (s.logo == favs.fieldByName('station')) {
				s.total = parseInt(favs.fieldByName('total'));
			}
		});
		favs.next();
	}
	favs.close();
	link.close();
	radiostations.sort(function(a, b) {
		return (b.total - a.total);
	});
	return radiostations;

};

exports.increment = function(id) {
	if (!id)
		return;
	const link = Ti.Database.open(DB);
	if (link) {
		const found = link.execute('select * from fav  where station="' + id
				+ '"');
		if (found.isValidRow()) {
			link.execute('update fav set total=total+1 where station="' + id
					+ '"');
			found.close();
		} else {
			link.execute('insert into fav (station,total) values ("' + id
					+ '",1)');
		}
		link.close();
	}
};

exports.getTotal = function(id) {
	var total = 0;
	const link = Ti.Database.open(DB);
	if (link) {

		const favs = link
				.execute((id == undefined) ? 'select SUM(total) as sum from fav'
						: 'select SUM(total) as sum from fav where station="'
								+ id + '"');
		if (favs.isValidRow()) {
			total = parseFloat(favs.fieldByName('sum'));
		}
		favs.close();
		link.close();
	}
	return total;
};
