const Favs = require('controls/favs');

module.exports = (PATH, updateStationMenu) => {
	const Radiostations = Favs.getAll();
	
	const $ = Ti.UI.createTableView({
		backgroundColor : '#efff',
		headerTitle : 'Verfügbare Radiostationen'
	});
	const onClick = (e) => {
		const itemId = e.row.itemId;
		if (e.row.children[0].value)
			Favs.enable(itemId);
		else
			Favs.disable(itemId);
		updateStationMenu();
	};
	$.addEventListener('click', onClick);
	$.updateContent = () => {
		$.data = Radiostations.map(require('ui/common/radio.drawer.row'));
		console.log("radioDrawer updated");
	};
	return $;
};
