const FAVS = "FAVS2";
const MAX = 7;
const EMPTY = JSON.stringify([]);

if (!Ti.App.Properties.hasProperty(FAVS)) {
	Ti.App.Properties.setString(FAVS, EMPTY);
}

exports.getAll = function() {
	const list = JSON.parse(Ti.App.Properties.getString(FAVS, EMPTY));
	return (Array.isArray(list)) ? list : [];
};

exports.getFirst = function() {
	return JSON.parse(Ti.App.Properties.getString(FAVS, EMPTY)).shift();
};

exports.add = function(newstation) {
	var newlist = JSON.parse(Ti.App.Properties.getString(FAVS, EMPTY)).filter(function(station) {
		return (newstation.logo != station.logo);
	});
	newlist.unshift(newstation);
	if (newlist.length > MAX)
		newlist.pop();
	Ti.App.Properties.setString(FAVS, JSON.stringify(newlist));
	return newlist;
};
