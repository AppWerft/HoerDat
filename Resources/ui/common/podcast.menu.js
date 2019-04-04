var АктйонБар = require('com.alcoapps.actionbarextras'),
    Moment = require('vendor/moment');

module.exports = function(_e) {
	const meta = _e.source.meta;
	АктйонБар.title = meta.title;
	АктйонБар.subtitle = meta.subtitle;
	АктйонБар.backgroundColor = "#225588";
	АктйонБар.titleFont = "Rambla-Bold";
	АктйонБар.subtitleColor = "#ccc";
	var activity = _e.source.getActivity();
	if (activity != undefined && activity.actionBar != undefined) { 
		activity.onCreateOptionsMenu = function(e) {
            activity.actionBar.displayHomeAsUp = true;
            e.menu.clear();
        };
		activity.actionBar.displayHomeAsUp = true;
		activity.actionBar.onHomeIconItemSelected = function() { // click on home
			_e.source.close();
		};
	}
};
