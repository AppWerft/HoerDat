const FAVS = "FAVS2";
const MAX = 5;
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

exports.add = function(station) {
	var list = JSON.parse(Ti.App.Properties.getString(FAVS, EMPTY));
	if (Array.isArray(list)) {
		list.unshift(station);	
		if (list.length > MAX)
			list.pop();
		Ti.App.Properties.setString(FAVS, JSON.stringify(list));
		return list;
	}
	return [];
};
