const АктйонБар = require('com.alcoapps.actionbarextras'), Moment = require('vendor/moment');
const Pool = require("controls/pool");

module.exports = function(_e) {
	const meta = _e.source.meta;
	АктйонБар.title = meta.title;
	АктйонБар.subtitle = meta.subtitle;
	АктйонБар.backgroundColor = "#225588";
	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	var activity = _e.source.getActivity();
	if (activity != undefined && activity.actionBar != undefined) {
		activity.onCreateOptionsMenu = function(_menue) {
			activity.actionBar.displayHomeAsUp = true;
			_menue.menu.clear();
			const menuItem = _menue.menu.add({
				title : 'Löschen',
				icon : Ti.App.Android.R.drawable.trash,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			});
			menuItem && menuItem.addEventListener("click", function(_evts) {
				const dialog = Ti.UI.createAlertDialog({
					cancel : 0,
					buttonNames : [ 'Nein, weiter …', 'Ja, Platz schaffen' ],
					message : 'Soll die lokale Kopie gelöscht werden?',
					title : 'Löschanfrage'
				});
				dialog.addEventListener('click', function(dialogevent) {
					if (dialogevent.index != dialogevent.source.cancel) {
						console.log("\n###########################"+_e.source.itemId);
						Pool.removeDownload(_e.source.itemId);
						_e.source.close();
					}
				});
				dialog.show();

			});

		};
		activity.actionBar.displayHomeAsUp = true;
		activity.actionBar.onHomeIconItemSelected = function() { // click on
			_e.source.close();
		};
		activity.invalidateOptionsMenu();
	} else
		console.log("cannot open menu");
};
