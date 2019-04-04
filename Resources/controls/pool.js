const DB = 'Pool4';
const STATE_ONLINE = 0, STATE_PROGRESS = 1, STATE_SAVED = 2;
const DownloadManager = require("com.miga.downloadmanager");

function hmsToSecondsOnly(str) {
	str=str.replace(/:$/,'');
	str=str.replace(/^:/,'');
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
	
	link.execute('UPDATE pool SET state=?,localfile=? WHERE url=?',
			STATE_PROGRESS, stripFilename(localfile), url);
	link.close();
}

function setStateToCached(localfile) {
	const link = Ti.Database.open(DB);
	if (link) {
	link.execute('UPDATE pool SET state=? WHERE localfile=?', STATE_SAVED,
			stripFilename(localfile));
	link.close();
	}
}

function setStateToOnline(localfile) {
	const link = Ti.Database.open(DB);
	if (link) {
	link.execute('UPDATE pool SET state=? WHERE localfile=?', STATE_ONLINE,
			stripFilename(localfile));
	link.close();
	}
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
		link.execute("UPDATE pool set position=?,faved=? WHERE url=?", position,Math.floor(new Date().getTime()/1000), url);
		link.close();
	} else
		console.log("no link to DB");
};

const getAllTotal = function(state,inprogress) {
	return getAll(state,inprogress).length;
}

const getAll = function(state, inprogress) {
	var res = [];
	var link = Ti.Database.open(DB);
	var where = ' WHERE 1=1 ';
	if (link) {
		where += ((state == undefined ? '' : 'AND  state=' + parseInt(state)));
		where += (inprogress == true ? ' AND position>0'
				: ' AND (position IS NULL OR position=0)');
		const sql = 'select * from pool ' + where + ' ORDER BY faved DESC';
		
		const found = link.execute(sql);
		while (found.isValidRow() == true) {
			var image = found.fieldByName('image');
			var duration = parseInt(found.fieldByName('duration') || 1); // ms.
			var position = parseInt(found.fieldByName('position') || 0); // ms
			res
					.push({
						title : found.fieldByName('title'),
						author : found.fieldByName('author'),
						position : position,
						duration : duration,
						progress : position / duration,
						durationstring : isNaN(duration) ? "":new Date(duration).toISOString().substr(11, 8),
						positionstring : isNaN(position) ? "":new Date(position).toISOString().substr(11, 8),
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
	console.log("TOTAL >>>>>>>>>>>>"+ state + '  '+ res.length);
	return (state == STATE_SAVED) ? res.filter(function(item) {
		return isFile(item.url);
	}) : res;

};

const syncAll = function(onReady) {
	
	const RSS =
	[	'http://www.mdr.de/kultur/podcast/hoerspiele/audiogalerie-106-podcast.xml',
		'https://www.ndr.de/kultur/radiokunst/podcast4336.xml',
		'https://www.kulturradio.de/zum_nachhoeren/podcast/hoerspiel-feed.xml/feed=podcast.xml',
		'https://www1.wdr.de/mediathek/audio/hoerspiel-speicher/wdr_hoerspielspeicher150.podcast',//
		'https://feeds.br.de/hoerspiel-pool/feed.xml' 
		];
	var count=RSS.length;
	RSS.forEach(function(url) {
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
									console.log("COUNT="+count);
									count--;
									if (count==0 && onReady && typeof onReady == 'function')
										onReady();
								});
			});
};

function replaceItem(_item, _link) {
	var title, author;
	var m;
	if (m = _item.title.match(/^(.*?):\s(.*)/)) {
		title = m[2];
		author = m[1];
	} else if (m = _item.title.match(/(.*?)\svon\s(.*)/)) {
		title = m[1];
		author = m[2];
	} else
		title = _item.title;
	author = _item.author;
	
	const item = {
		author : author,
		weblink : _item.link,
		title : title,
		image : _item.image ? _item.image : null,
		description : _item.description,
		url : _item.enclosure.url,
		duration : (function(duration) {
			
			if (duration) {
				return 1000 * hmsToSecondsOnly(duration)
			} else {
				return 0;
			}
		})(_item.duration)
	};
	
	const found = _link.execute('select * from pool  where url=?', item.url);
	if (found.isValidRow()) {
		found.close();
		_link.execute("update pool set duration=?,author=?, title=? where url=?",
				item.duration,item.author, item.title, item.url);

	} else {
		_link
				.execute(
						"insert into pool (author, weblink,title,description,image,url,duration,faved,state,pubdate) values (?,?,?,?,?,?,?,?,?,?)",
						item.author, item.weblink, item.title,
						item.description, item.image, item.url, item.duration,Math.round(new Date().getTime()/1000),0,item.pubDate);
	}

}

const isFile = (url) => {
	const filename = url.substring(url.lastIndexOf('/') + 1);
	return Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,
			filename).exists();
	;
};

const getCachedFile = (url) => {
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
	console.log("setStateToProgress:::" + filename);
	DownloadManager.enableNotification();
	DownloadManager.setEventName("download::ready");
	DownloadManager.startDownload({
		url : url,
		filename : file,
		success : function() {
			DownloadManager.getAllDownloads().forEach(function(dl) {
				console.log(dl);
				if (dl.status == DownloadManager.STATUS_SUCCESSFUL) {
					console.log("setStateToCache:::" + dl.filename);
					setStateToCached(stripFilename(dl.filename));
				}	
				else if (dl.status == DownloadManager.STATUS_FAILED)
					setStateToOnline(dl.filename);
			});
			
		},
		title : title,
		description : filename
	});
	return true;
};

exports.getAll = getAll;
exports.getAllTotal = getAllTotal;
exports.setPosition = setPosition;
exports.getPosition = getPosition;

exports.syncAll = syncAll;
exports.downloadFile = downloadFile;
exports.getCachedFile = getCachedFile;