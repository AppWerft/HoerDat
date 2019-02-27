module.exports = function(args) {
	var self = {};
	var ready = false;
	var count = 0;
	var url = 'http://s507870211.online.de/index.php?col1=ti&a=' + encodeURI(args.payload.a) + '&so=autor&soo=asc';
	var Soup = require("de.appwerft.soup");
	console.log(url);
	Soup.createJSONObject({
		url:url,
		onLoad: function(res){
			console.log(res);	
		}
		
	});
	var Doc = Soup.createDocument({
		url : url,
		onload : function() {
			var tables = Doc.select("table");
			tables.forEach(function(table) {
				if (!table.hasClassName("form")) {
					var tableRows = table.getChild(0).getChildren();
					tableRows.forEach(function(tr) {
						console.log(tr.toString());
					});
				}
			});
		}
	});
	console.log(url);
	/*
	 [0, 6000, 12000].forEach(function(delay) {
	 setTimeout(function() {
	 require('controls/getyahoo')(url, function(_res) {
	 if (ready == false) {
	 args.onload(_res);
	 clearInterval(self.cron);
	 ready = true;
	 }
	 }, function() {
	 count++;
	 if (count == 3) {
	 clearInterval(self.cron);
	 args.onerror();
	 }
	 });
	 }, delay);
	 });
	 self.tick = 0;
	 self.cron = setInterval(function() {
	 self.tick++;
	 args.onprogress(self.tick / 100);
	 }, 200);*/
	return;

};
