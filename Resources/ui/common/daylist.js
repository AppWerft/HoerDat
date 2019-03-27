var АктйонБар = require('com.alcoapps.actionbarextras');

module.exports = function(i) {
	var data = [];
	var self = Ti.UI.createView({
		backgroundColor : '#326598'
	});
	self.list = Ti.UI.createTableView({
		data : data,
		bottom : 30,
		backgroundColor : 'white'
	});
	self.tag = Ti.UI.createLabel({
		bottom : 0,
		height : 30,
		color : 'white',
		font : {
			fontFamily : 'Rambla-Bold',
			fontSize : 22
		}

	});
	self.add(self.list);
	self.add(self.tag);
	setTimeout(function() {
		require('controls/html.adapter')({
			date : (require('vendor/moment'))().add(i, 'd').format('YYYY-MM-DD'),
			onload : function(list) {
				data = [];
				list.forEach(function(item) {
					data.push(require('ui/common/row.widget')(item));
				});
				self.list.data= data;
			}
		});
	}, Math.abs(i) * Math.random() * 5000);

	self.list.addEventListener('click', function(_e) {
		var item = _e.rowData.itemId;
		require('ui/common/sendung.window')(item).open();
	});

	var tag = '';
	var moment = require('vendor/moment');
	moment.locale('de');
	switch (i) {
	case -1 :
		tag = 'Gestern';
		break;
	case 0 :
		tag = 'Heute';
		break;
	case 1 :
		tag = 'Morgen  (' + moment().add(i, 'd').format('dddd') + ')';
		break;
	case 2:
		tag = 'Übermorgen (' + moment().add(i, 'd').format('dddd') + ')';
		break;
	default:
		tag = moment().add(i, 'd').format('dddd') + ', den ' + moment().add(i, 'd').format('LL');
	}
	self.tag.text = tag;
	return self;
};
