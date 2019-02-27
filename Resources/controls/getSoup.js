

module.exports = function(url, onload, onerror) {
	function getSendung(item) {
		var sendung = {};
		var rows = item.getChildren().filter(function(tr) {
			return !tr.getChild(0).hasClassName("navi");
		});
		rows.forEach(function(tr, ndx) {
			const td0 = tr.getChild(0);
			const td1 = tr.getChild(1);

			if (td0.hasClassName("right")) {
				var key = td.toString();
				switch (key) {
				case 'Autor(en):':
					sendung.autor = td1.toString();
					break;
				case 'Inhaltsangabe:':
					item.inhalt = td1.toString();
					break;
				case 'Produktion:':
					item.produktion = td1.toString();
					/*var res = /^[A-Za-z]+/.exec(item.produktion);
					 console.log(res);
					 if (res && res instanceof Array)
					 item.logo = '/images/' + res[res.length - 1].toLowerCase() + '.png';
					 */
					break;
				case 'Komponist(en):':
					item.komponisten = td1.toString();
					break;
				case 'Regisseur(e):':
					item.regisseure = td1.toString();
					break;
				case 'Übersetzer:':
					item.uebersetzer = td1.toString();
					break;
				case 'Mitwirkende:':
					item.mitwirkende = td1.toString();
					break;
				}

			} else {
				sendung.title = td0.getChild(0).toString();
			}
			console.log(tr.toString());
		});
		console.log(sendung);
	}

	var sendungen = [];
	var Doc = Soup.createDocument({
		url : url,
		onload : function() {
			Doc.select("table").forEach(function(table) {
				if (!table.hasClassName("mit") && !table.hasClassName("form")) {
					sendungen.push(getSendung(table.getChild(1)));
				}
			});
		}
	});
};
