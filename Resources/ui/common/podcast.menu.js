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
	if (activity) {
		activity.onCreateOptionsMenu = function(_e) {
			_e.menu.clear();
			//var seconds = Moment(data.time_isostring).unix() - Moment().unix();
			activity.actionBar.displayHomeAsUp = true;
			
		};
		activity.actionBar.homeButtonEnabled = true;
		activity.actionBar.onHomeIconItemSelected = function() {
			_e.source.close();
		};
	}
};
