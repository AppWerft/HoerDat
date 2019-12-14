const Favs = require('controls/favs');

module.exports = (PATH, updateStationMenu) => {
	var Radiostations = Favs.getAll();
	
	const $ = Ti.UI.createTableView({
		backgroundColor : '#efff',
		 headerView : require("ui/common/headerview.widget")('Ausgewählte Radiostationen')
	});
	const onClick = (e) => {
	    Ti.Media.vibrate();
		const itemId = e.row.itemId;
		if (e.row.children[0].value)
			Favs.enable(itemId);
		else
			Favs.disable(itemId);
		updateStationMenu && updateStationMenu();
	};
	$.addEventListener('click', onClick);
	$.updateContent = () => {
	    console.log("radioDrawer::updateConent");
		$.data = Favs.getAll().map(require('ui/common/radio.drawer.row'));
	};
	return $;
};
