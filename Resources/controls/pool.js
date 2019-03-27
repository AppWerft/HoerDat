var dmg = require("com.miga.downloadmanager");

const DB = 'Pool2';

var link = Ti.Database.open(DB);
link
		.execute('CREATE TABLE IF NOT EXISTS "pool" ("title" VARCHAR, "author" VARCHAR, "keywords" VARCHAR,"weblink" VARCHAR, "description" VARCHAR, "pubdate" VARCHAR,"depubdate" VARCHAR, "duration" INTEGER,"image" VARCHARs,"position" INTEGER,"url" VARCHAR, "cached" INTEGER,"faved" INTEGER);');
link.close();

exports.getAll = function() {
	var res = [];
	
	var link = Ti.Database.open(DB);
	if (link) {
		const found = link.execute('select * from pool ORDER BY pubdate DESC');
		while (found.isValidRow() == true) {
			var image = found.fieldByName('image');
			res.push({
				title : found.fieldByName('title'),
				author : found.fieldByName('author'),
				url : found.fieldByName('url'),
				image : image || 'https://www.br.de/podcast-hoerspiel-pool-100~_v-img__16__9__m_-4423061158a17f4152aef84861ed0243214ae6e7.jpg?version=4c9dc',
				description : found.fieldByName('description'),
				min : Math
						.round(parseInt(found.fieldByName('duration')) / 6000),
				duration : found.fieldByName('duration'),
				faved : found.fieldByName('faved'),
				cached : found.fieldByName('cached'),
				

			});
			found.next();
		}
		found.close();
		link.close();
	}
	return res;
};

exports.syncAll = function() {
	[
			'https://www1.wdr.de/mediathek/audio/hoerspiel-speicher/wdr_hoerspielspeicher150.podcast',
			'https://feeds.br.de/hoerspiel-pool/feed.xml' ]
			.forEach(function(url) {
				require("de.appwerft.podcast")
						.loadPodcast(
								{
									url : url,
									timeout : 10000,
									userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
								}, function(_e) {
									var link = Ti.Database.open(DB);
									if (link) {
										link.execute("BEGIN TRANSACTION");
										_e.items.forEach(function(item) {
											replaceItem(item, link);
										});
										link.execute("COMMIT");
										link.close();
									}
								});
			});
};

function replaceItem(_item, _link) {
	const titleparts = _item.title.split(': ');
	const item = {
		author : titleparts.length == 2 ? titleparts[0] : _item.author,
		weblink : _item.link,
		title : titleparts.length == 2 ? titleparts[1] : _item.title,
		image : _item.image ? _item.image : null,
		description : _item.description,
		
		url : _item.enclosure.url,
		duration : (function(duration) {
			if (duration) {
				const parts = duration.split(':');
				return parts[0] * 3600 + parts[1] * 60 + parts[2];
			} else {
				console.log(_item);
				return 0;
			}
		})(_item.duration)
	};

	const found = _link.execute('select * from pool  where url=?', item.url);
	if (found.isValidRow()) {
		found.close();
	} else {
		_link
				.execute(
						"insert into pool (author, weblink,title,description,image,url,duration,cached,faved,pubdate) values (?,?,?,?,?,?,?,0,0,?)",
						item.author, item.weblink, item.title,
						item.description, item.image, item.url, item.duration,item.pubDate);
	}

}



exports.downloadFile = function(url,title,onDone) {
	var filename = url.substring(url.lastIndexOf('/') + 1);
	var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, filename).nativePath;
	dmg.startDownload({
	    url: url,
	    filename: file,
	    success: onDone,
	    title: "Download",
	    description: "Download " + title
	});
};


