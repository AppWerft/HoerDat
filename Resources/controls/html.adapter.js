const Soup = require("de.appwerft.soup");

const Moment = require('vendor/moment');
Moment.locale('de');

module.exports = function(args) {
	if (Ti.App.Properties.hasProperty(args.date)) {
		console.log("always onboard: " + args.date);
		args.onload(JSON.parse(Ti.App.Properties.getString(args.date)));
		return;
	}

	var sendungen = [];
	var Doc = Soup.createDocument({
		url : 'http://s507870211.online.de/index.php?aktion=suche&dat='
				+ args.date,
		onload : function() {
			if (Doc) {
				Doc.select("table").forEach(
						function(table) {
							if (!table.hasClassName("mit")
									&& !table.hasClassName("form")) {
								sendungen.push(getSendung(table.getChild(1)));
							}
						});
				Ti.App.Properties.setString(args.date, JSON
						.stringify(sendungen));
				args.onload(sendungen);
			}
		}
	});

	return;

};

function getSendung(item) {
	var sendung = {};
	var rows = item.getChildren().filter(function(tr) {
		return !tr.getChild(0).hasClassName("navi");
	});
	rows.forEach(function(tr, ndx) {
		const tdleft = tr.getChild(0);
		const len = tr.getChildren().length;
		if (len > 1)
			var tdright = tr.getChild(1);
		if (tdleft.hasClassName("right") && len > 1) {
			var key = tdleft.getText();

			// console.log(value.toString());
			switch (key) {
			case 'Sendetermine:':
				var html = tdright.getHtml().split('<br>')[0];
				sendung.stationlogo = '/images/mini/'
						+ html.split(' - ')[0].toLowerCase()//
						.replace(/\s/g, '')//
						.replace(/ö/g, 'oe')//
						.replace(/,/g, '')//
						.replace(/\-/g, '') + '.png';
				sendung.start = getTime(html.split(' - ')[1]).start.toISOString();
				sendung.meta = getTime(html.split(' - ')[1]).meta;

				break;
			case 'Autor(en):':
				sendung.autor = tdright.getHtml().replace(/<br>/, '\n');
				break;
			case 'Inhaltsangabe:':
				sendung.inhalt = tdright.getHtml();
				break;
			case 'Produktion:':
				sendung.produktion = tdright.getHtml();
				var res = /^[A-Za-z]+/.exec(tdright.getHtml());

				if (res && res instanceof Array)
					sendung.prodlogo = '/images/mini/'
							+ res[res.length - 1].toLowerCase() + '.png';

				break;
			case 'Komponist(en):':
				sendung.komponisten = tdright.getHtml().replace(/<br>/, '\n');
				break;
			case 'Regisseur(e):':
				sendung.regisseure = tdright.getHtml().replace(/<br>/, '\n');
				break;
			case 'Übersetzer:':
				sendung.uebersetzer = tdright.getHtml().replace(/<br>/, '\n');
				break;
			case 'Mitwirkende:':
				sendung.mitwirkende = tdright.toString();
				break;
			}

		} else {
			sendung.title = tdleft.getChild(0).getText().trim();
		}
	});
	// console.log(sendung);
	return sendung;
}

function getTime(foo) {

	const regex = /^([\S]+),\s([\d]+)\.\s([\S]+)\s([\d]+)\s([\d]+):([\d]+)([\,\s]*)(.*)/, match = regex
			.exec(foo);

	if (match) {
		const dddd = match[1], D = match[2], MMM = match[3].replace('Mär',
				'Mrz').replace("Feb", "Febr"), YYYY = match[4], H = match[5], m = match[6], meta = match[8]
				.replace(/[\s\s]+/, ' ');
		const PATTERN = "YYYY-MMM-D H:m";
		const date = Moment(YYYY + '-' + MMM + '-' + D + ' ' + H + ':' + m,
				PATTERN);

		return ({
			meta : meta,
			start : date
		});
	} else
		return {
			meta : "",
			start : Moment()
		};
}
