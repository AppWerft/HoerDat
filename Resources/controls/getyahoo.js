function getText(foo) {
	if (!foo)
		return '';
	if ( typeof foo == 'string')
		return foo.replace(/\n/gm, '').trim();
	if (foo.content) {
		return foo.content.replace(/[\s]{3,}/gm, '\n').trim();
	} else
		return foo[0].content.replace(/[\s]{3,}/gm, '\n').trim();
}

module.exports = function(url, onload, onerror) {
	var Parser = require("de.appwerft.remotexml");
	Parser.createClient({
		url : url,
		onload : function(e) {
			console.log(">>>>>>>>>>>>  XML");
			console.log(e.data);
			console.log(e.data);
		}
	});
	return;
	Ti.Yahoo.yql('select * from html where url="' + url + '" and xpath="//table"', function(_res) {
		if (_res.success && _res.data && _res.data.table && _res.data.table.length > 2) {
			var tables = _res.data.table;
			var res = [];
			tables.forEach(function(table) {
				if (table.class != 'form') {
					var item = {};
					table.tbody.tr && table.tbody.tr instanceof Array && table.tbody.tr.forEach(function(tr) {
						if (tr.th) {
							item.title = tr.th.h1;
							item.subtitle = tr.th.h2;
						}
						if (tr.td && tr.td.class != 'navi') {
							for (var i = 0; i < tr.td.length; i++) {
								if (tr.td[i].class == 'right') {
									switch (tr.td[i].content) {
									case 'Autor(en):':
										item.autor = getText(tr.td[i + 1].content);
										break;
									case 'Inhaltsangabe:':
										item.inhalt = getText(tr.td[i + 1]);
										break;
									case 'Produktion:':
										item.produktion = tr.td[i + 1];
										var res = /^[A-Za-z]+/.exec(item.produktion);
										console.log(res);
										if (res && res instanceof Array)
											item.logo = '/images/' + res[res.length - 1].toLowerCase() + '.png';

										break;
									case 'Komponist(en):':
										item.komponisten = getText(tr.td[i + 1].content);
										break;
									case 'Regisseur(e):':
										item.regisseure = getText(tr.td[i + 1].content);
										break;
									case 'Übersetzer:':
										item.uebersetzer = getText(tr.td[i + 1].content);
										break;
									case 'Mitwirkende:':
										item.mitwirkende = require('controls/staff')(tr.td[i + 1]);
										break;
									}
								}
							};
						}
					});
					// if (table.tr[2].td) {
					//  item.meta = table.tr[2].td[1].content.content;
					//}

					if (item.title) {
						res.push(item);
					}
				}
			});
			onload(res);
		} else {
			onerror();
		}

	});
};
