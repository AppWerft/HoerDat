const Pool = require("controls/pool");

module.exports = function(window) {
	const itemId = window.itemId;
	const dialog = Ti.UI.createAlertDialog({
		cancel : 0,
		buttonNames : ['Nein, weiter …', 'Ja, Platz schaffen'],
		message : 'Was soll jetzt geschehen - lokal löschen oder zurück zum Start?',
		title : 'Geschafft.'
	});
	dialog.addEventListener('click', function(dialogevent) {
		Pool.resetPosition(itemId);
		if (dialogevent.index != dialogevent.source.cancel) {
			Pool.removeDownload(itemId);
		}
		window.close();
	});
	dialog.show();
	
}; 