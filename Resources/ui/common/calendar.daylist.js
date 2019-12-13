
const Row = require('ui/common/calendar_row.widget');

module.exports = function(offs) {
	var data = [];
	var self = Ti.UI.createView({
		backgroundColor : '#326598'
	});
	self.list = Ti.UI.createTableView({
		data : data,
		bottom : 30,
		separatorStyle : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE,
		separatorColor : 'gray',
		backgroundColor : 'white'
	});
	self.tag = Ti.UI.createLabel({
		bottom : 0,
		height : 30,
		color : 'white',
		font : {
			fontFamily : 'Rambla-Bold',
			fontSize : 20
		}

	});
	self.add(self.list);
	self.add(self.tag);
	setTimeout(function() {
		const date = (require('vendor/moment'))().add(offs, 'd').format('YYYY-MM-DD');

		require('controls/html.adapter')({
			date : date,
			onload : function(list) {
				data = [];
				list.forEach(function(item) {
					const row = Row(item);
					data.push(row);
				});
				self.list.data = data;
			}
		});
	}, Math.abs(offs) * Math.random() * 5000);

	self.list.addEventListener('click', function(_e) {
		if (_e.source.status != undefined) {
			_e.source.toggleStatus();
		} else
			require('ui/common/sendung.window')(_e.rowData.itemId).open();
	});

	var tag = '';
	var moment = require('vendor/moment');
	moment.locale('de');
	switch (offs) {
	case -1 :
		tag = 'Gestern';
		break;
	case 0 :
		tag = 'Heute';
		break;
	case 1 :
		tag = 'Morgen  (' + moment().add(offs, 'd').format('dddd') + ')';
		break;
	case 2:
		tag = 'Übermorgen (' + moment().add(offs, 'd').format('dddd') + ')';
		break;
	default:
		tag = moment().add(offs, 'd').format('dddd') + ', den ' + moment().add(offs, 'd').format('LL');
	}
	self.tag.text = tag;
	return self;
};
