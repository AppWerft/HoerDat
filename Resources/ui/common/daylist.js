var АктйонБар = require('com.alcoapps.actionbarextras');


module.exports = function(i) {
	var data = [];
	var self = Ti.UI.createView({
		backgroundColor : '#326598'
	});
	self.list = Ti.UI.createTableView({
		data : data,
		bottom : 0,
		backgroundColor : 'white'
	});

	self.add(self.list);
	setTimeout(function() {
		require('controls/html.adapter')({
			date : (require('vendor/moment'))().add(i, 'd').format('YYYY-MM-DD'),
			onload : function(list) {
				data = [];
				list.forEach(function(item) {
					data.push(require('ui/common/row.widget')(item));
				});
				self.list.setData(data);
			}
		});
	}, Math.abs(i) * Math.random() * 1111);

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
		tag = 'Morgen';
		break;
	case 2:
		tag = 'Übermorgen (' + moment().add(i, 'd').format('dddd') + ')';
		break;
	default:
		tag = moment().add(i, 'd').format('dddd') + ', den ' + moment().add(i, 'd').format('LL');
	}
	self.addEventListener('focus',function(){
		АктйонБар.subTitle = tag;
		
	});
	Ti.App.fireEvent('app:set', {
		subTitle : tag
	});
	
	/*self.add(Ti.UI.createLabel({
	 height : 40,
	 bottom : 0,
	 color : 'white',
	 font : {
	 fontSize : 20,
	 fontFamily : 'Rambla-Bold'
	 },
	 textAlign : 'center',
	 text : tag
	 }));*/
	return self;
};
