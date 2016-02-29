

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

var Moment = require('vendor/moment');
Moment.locale('de');

module.exports = function(args) {
	if (Ti.App.Properties.hasProperty(args.date)) {
		args.onload(JSON.parse(Ti.App.Properties.getString(args.date)));
		//return;
	}
	var yql = 'select * from html where url="http://s507870211.online.de/index.php?aktion=suche&dat=' + args.date + '" and xpath="//table"';
	Ti.Yahoo.yql(yql, function(_res) {
		if (_res.success && _res.data && _res.data.table && Array.isArray(_res.data.table)) {
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
								if (tr.td[i].class == 'right') {// metas
									//  console.log("|"+tr.td[i].content+'|');
									switch (tr.td[i].content) {
									case 'Sendetermine:':
										item.meta = getText(tr.td[i + 1].content).replace('angekündigte Länge:    ', 'ca. Länge:');
										item.station = item.meta.split(' - ')[0];
										var res = item.meta.match(/\s(\d\d:\d\d)/);
										//item.time = item.meta.split(' - ')[1]//
										//.replace(/\,/g, '')//
										//.replace('Mär', 'März')//
										//.replace(/ \(.*/, '')//

										//.replace(/ WDR.*/, '')//
										//.replace(/ Teil.*/, '');
										item.time = res[1];
										//  console.log(item);
										
										var datestring = args.date + ' ' + item.time;
										var date = Moment(datestring, 'YYYY-MM-DD HH:mm');
										item.time_isostring = date.toISOString();
										item.time = date;
													//item.time_isostring = item.time.toISOString();
										var res = /^(.*?)\s/.exec(item.meta);
										if (res) {
											item.logo = '/images/' + res[1].toLowerCase() + '.png';
										}
										// Startzeit:
										res = /Länge: (.*?)\)/.exec(item.meta);
										if (res) {
											var duration = res[1];
											var parts = duration.split(':');
											if (parts) {
												item.duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
											}
											res = /\s(\d\d:\d\d),/.exec(item.meta);
											if (res) {
												parts = item.meta.split(', ');
												if (parts) {
													item.start = Moment(parts[1] + parts[2], 'D. MMM YYYY HH:mm');
													item.end = Moment(item.start).add(item.duration, 'seconds');
												}
											}
										}
										if (tr.td[1] && tr.td[1].div && tr.td[1].div.a) {
											tr.td[1].div.a.forEach(function(link) {
												if (/^mp3/i.test(link.content)) {
													if (/\.m3u$/.test(link.href))
														item.playlist = link.href;
													else
														item.stream = link.href;
												}
											});
										} else {
										}

										break;
									case 'Autor(en):':
										item.autor = tr.td[i + 1].content;
										break;
									case 'Inhaltsangabe:':
										item.inhalt = getText(tr.td[i + 1]);
										break;
									case 'Produktion:':
										item.produktion = tr.td[i + 1];
										break;
									case 'Komponist(en):':
										item.komponisten = tr.td[i + 1].content;
										break;
									case 'Regisseur(e):':
										item.regisseure = tr.td[i + 1].content;
										break;
									case 'Übersetzer:':
										item.uebersetzer = tr.td[i + 1].content;
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
					//  item.meta = table.tr[2].td[1].p.content;
					//}
					if (item.title) {
						res.push(item);
					}
					res.sort(function(a, b) {
						return a.time.unix() - b.time.unix();
					});
				}
			});
			Ti.App.Properties.setString(args.date, JSON.stringify(res));
			args.onload(res);
		} else {
			console.log('wrong answer from YQL');
			console.log(res);
		}
	});
	return;
	var self = Ti.Network.createHTTPClient({
		onload : function() {
			var html = this.responseText.replace(/>\s+</gm, '><');
			var regex = /<th colspan='2'>(.*?)<\/th>/gim;
			var list = [];
			while ( res = regex.exec(html)) {
				var h = /<h1>(.*?)<\/h1><h2>(.*?)<\/h2>/gm;
				var title = h.exec(res[1]);
				if (title)
					list.push({
						title : title[1].trim(),
						subtitle : title[2].trim()
					});
				else {
					h = /<h1>(.*?)<\/h1>/gm;
					title = h.exec(res[1]);
					list.push({
						title : title[1].trim()
					});
				}
			}
			args.onload(list);
		}
	});
	self.open('GET', 'http://s507870211.online.de/index.php?aktion=suche&dat=' + args.date);
	self.setRequestHeader('Accept', 'application/json');
	self.send();

};
var _ = {
	"td" : [{
		"class" : "right",
		"content" : "Sendetermine:"
	}, {
		"br" : null,
		"div" : {
			"class" : "streams",
			"a" : [{
				"href" : "http://www.dradio.de/streaming/dkultur.asx",
				"title" : "DLR-Windows Mediaplayer-Stream",
				"content" : "winmedia-Stream"
			}, {
				"href" : "http://www.dradio.de/streaming/dkultur.m3u",
				"title" : "DLR-MP3-Stream",
				"content" : "mp3-Stream"
			}, {
				"href" : "http://www.dradio.de/streaming/dkultur_mq_ogg.m3u",
				"title" : "DLR-Ogg Vorbis-Stream (mittlere Qualität)",
				"content" : "ogg-Stream"
			}, {
				"href" : "http://www.dradio.de/streaming/dkultur_hq_ogg.m3u",
				"title" : "DLR-Ogg Vorbis-Stream (hohe Qualität)",
				"content" : "ogg-Stream"
			}],
			"content" : " [] \n [] \n [] \n [] \n"
		},
		"content" : " DLR - Montag,  6. Apr 2015 00:05, (angekündigte Länge:    55:00)\n\n"
	}]
};
