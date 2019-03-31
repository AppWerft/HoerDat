const DB = 'Pool4';
const STATE_ONLINE = 0, STATE_PROGRESS = 1, STATE_SAVED = 2;
const DownloadManager = require("com.miga.downloadmanager");
function hmsToSecondsOnly(str) {
	var p = str.split(':'), s = 0, m = 1;
	while (p.length > 0) {
		s += m * parseInt(p.pop(), 10);
		m *= 60;
	}
	return s;
}

var link = Ti.Database.open(DB);
link
		.execute('CREATE TABLE IF NOT EXISTS "pool" ("title" VARCHAR, "author" VARCHAR, "keywords" VARCHAR,"weblink" VARCHAR, "description" VARCHAR, "pubdate" VARCHAR,"depubdate" VARCHAR, "duration" INTEGER,"image" VARCHARs,"position" INTEGER,"url" VARCHAR, "state" INTEGER,"faved" INTEGER, localfile STRING);');
link.close();

function stripFilename(url) {
	if (url) {
		const ndx = url.lastIndexOf('/');
		return url.substring(ndx + 1);
	}
}

function setStateToProgress(url, localfile) {
	const link = Ti.Database.open(DB);
	console.log("setStateToProgress: url=" + url + ' lf='
			+ stripFilename(localfile));
	link.execute('UPDATE pool SET state=?,localfile=? WHERE url=?',
			STATE_PROGRESS, stripFilename(localfile), url);
	link.close();
}

function setStateToOffline(localfile) {
	const link = Ti.Database.open(DB);
	console.log("setStateToOffline: " + stripFilename(localfile));
	link.execute('UPDATE pool SET state=? WHERE localfile=?', STATE_SAVED,
			stripFilename(localfile));
	link.close();
}

const getPosition = function(url) {
	var link = Ti.Database.open(DB);
	var position = 0;
	if (link) {
		const cursor = link.execute('SELECT position FROM pool WHERE url="'
				+ url + '"');
		if (cursor.isValidRow() == true) {
			position = cursor.fieldByName('position');
			cursor.close();
		}
		link.close();
	}
	return position;
};

const setPosition = function(url, position) {

	if (position < 10000)
		return;
	var link = Ti.Database.open(DB);
	if (link) {
		link.execute("UPDATE pool set position=? WHERE url=?", position, url);
		link.close();
	} else
		console.log("no link to DB");
	return getPosition(url);
};

const getAll = function(state) {
	var res = [];
	var link = Ti.Database.open(DB);
	if (link) {
		const where = (state == undefined ? '' : 'where state='
				+ parseInt(state));
		const sql = 'select * from pool ' + where + ' ORDER BY pubdate DESC';

		const found = link.execute(sql);
		while (found.isValidRow() == true) {
			var image = found.fieldByName('image');
			var duration = parseInt(found.fieldByName('duration') || 0); // ms.
			var position = parseInt(found.fieldByName('position') || 0); // ms
			//console.log(duration);
			//console.log(position);

			res
					.push({
						title : found.fieldByName('title'),
						author : found.fieldByName('author'),
						position : position,
						duration : duration,
						durationstring : new Date(duration)
								.toISOString().substr(11, 8),
						positionstring : new Date(position).toISOString()
								.substr(11, 8),
						duration : duration,
						position : position,
						url : found.fieldByName('url'),
						image : image
								|| 'https://www.br.de/podcast-hoerspiel-pool-100~_v-img__16__9__m_-4423061158a17f4152aef84861ed0243214ae6e7.jpg?version=4c9dc',
						description : found.fieldByName('description'),
						faved : found.fieldByName('faved'),
						state : found.fieldByName('state'),

					});
			found.next();
		}
		found.close();
		link.close();
	}
	return (state == STATE_SAVED) ? res.filter(function(item) {
		return isFile(item.url);
	}) : res;

};

const syncAll = function(onReady) {
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
								},
								function(_e) {
									var link = Ti.Database.open(DB);
									if (link) {
										link.execute("BEGIN TRANSACTION");
										_e.items.forEach(function(item) {
											replaceItem(item, link);
										});
										link.execute("COMMIT");
										link.close();
									}
									if (onReady && typeof onReady == 'function')
										onReady();
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
				return 1000* hmsToSecondsOnly(duration)
			} else {
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
						"insert into pool (author, weblink,title,description,image,url,duration,faved,state,pubdate) values (?,?,?,?,?,?,?,0,0,?)",
						item.author, item.weblink, item.title,
						item.description, item.image, item.url, item.duration,
						item.pubDate);
	}

}

const isFile = function(url) {
	const filename = url.substring(url.lastIndexOf('/') + 1);
	return Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,
			filename).exists();
	;
};

const getCachedFile = function(url) {
	const file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,
			stripFilename(url));
	return file.exists ? file : null;
};

const downloadFile = function(url, title, cb) {
	const filename = stripFilename(url), file = Ti.Filesystem.getFile(
			Ti.Filesystem.externalStorageDirectory, filename).nativePath;
	var match = DownloadManager.getDownloads().filter(function(dl) {
		return (stripFilename(dl.filename) == stripFilename(file));
	});
	// if (match.length > 0)
	// return false;
	setStateToProgress(url, filename);

	DownloadManager.startDownload({
		url : url,
		filename : file,
		success : function() {
			DownloadManager.getDownloads().forEach(function(dl) {
				console.log(dl);
				setStateToOffline(dl.filename);
			});
			cb({
				title : title,
				success : true,
				url : url
			});
		},
		title : title,
		description : filename
	});
	return true;
};

exports.getAll = getAll;
exports.setPosition = setPosition;
exports.getPosition = getPosition;

exports.syncAll = syncAll;
exports.downloadFile = downloadFile;
exports.getCachedFile = getCachedFile;