const DEPOT = "SETTINGS";
const DEFAULTS = {
	PLAYERSTOPSPINCH : true,
	PLAYERSTOPSDBLCLICK : true

};
if (!Ti.App.Properties.hasProperty(DEPOT))
	Ti.App.Properties.setString(DEPOT, JSON.stringify(DEFAULTS));

exports.set = (k,v) => {
	var Depot = JSON.parse(Ti.App.Properties.getString(DEPOT, '{}'));
	Depot[k] = v;
	Ti.App.Properties.setString(DEPOT, JSON.stringify(Depot));
};
exports.get = k => {
	var Depot = JSON.parse(Ti.App.Properties.getString(DEPOT, '{}'));
	return DEPOT[k];
};

