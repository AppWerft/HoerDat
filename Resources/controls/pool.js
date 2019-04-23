const DB = 'Pool4';
const STATE_ONLINE = 0, STATE_PROGRESS = 1, STATE_SAVED = 2;
const Downloader = require("de.appwerft.downloadmanager");


const addColumn = function(dbname, tblName, newFieldName, colSpec) {
    var db = Ti.Database.open(dbname);
    var fieldExists = false;
    resultSet = db.execute('PRAGMA TABLE_INFO(' + tblName + ')');
    while (resultSet.isValidRow()) {
        if(resultSet.field(1)==newFieldName) {
            fieldExists = true;
        }
        resultSet.next();
    } // end while
    if(!fieldExists) {
        // field does not exist, so add it
        db.execute('ALTER TABLE ' + tblName + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
    }
    db.close();
};
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

addColumn(DB, "pool", "id", "Number");

function stripFilename(url) {
	if (url) {
		const ndx = url.lastIndexOf('/');
		return url.substring(ndx + 1);
	}
}

function removeDownload(id) {
	console.log("try to forget download with id " + id);
	const link = Ti.Database.open(DB);
	link.execute('UPDATE pool SET state=? WHERE id=?',
			STATE_ONLINE,id);
	link.close();
	const count = Downloader.removeDownloadById(id);
	Ti.App.fireEvent('renderPool',{});
}

function setStateToProgress(localfile,id,url) {
	const link = Ti.Database.open(DB);
	
	link.execute('UPDATE pool SET id=?,state=?,localfile=? WHERE url=?',
			id,STATE_PROGRESS, stripFilename(localfile), url);
	link.close();
}


function getStorageStatistics() {
	return Downloader.getStorageStatistics();
}

function syncAllDownloads() {
	const downloads = Downloader.getSuccessfulDownloads();
	var link = Ti.Database.open(DB);
	if (link) {
		link.execute("BEGIN TRANSACTION");
		downloads.forEach(function(d){
			link.execute('UPDATE pool SET state=? WHERE id=?',STATE_SAVED,d.id);
		});
		link.execute("COMMIT");
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
						id: found.fieldByName('id'),
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
									if (!_e.items) return;
									var link = Ti.Database.open(DB);
									if (link) {
										link.execute("BEGIN TRANSACTION");
										_e.items.forEach(function(item) {
											replaceItem(item, link);
										});
										link.execute("COMMIT");
										link.close();
									}
									
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

Downloader.onComplete = function(e){
	syncAllDownloads();
	Ti.App.fireEvent('renderPool',{});
};
Downloader.onDone =function(e){
	console.log(e);
	Ti.App.fireEvent('renderPool',{});
};


const downloadFile = function(url, title, cb) {
	const filename = stripFilename(url), file = Ti.Filesystem.getFile(
			Ti.Filesystem.externalStorageDirectory, filename);
	
	const Request = Downloader.createRequest(url);
	Request
		.setNotificationVisibility(Request.VISIBILITY_VISIBLE)
		.setDestinationFile(file)
		.setTitle(title)
		.setDescription(filename);
	setStateToProgress(filename,Downloader.enqueue(Request),url);
	return true;
};

exports.getAll = getAll;
exports.getAllTotal = getAllTotal;
exports.setPosition = setPosition;
exports.getPosition = getPosition;
exports.removeDownload = removeDownload;
exports.syncAll = syncAll;
exports.getStorageStatistics = getStorageStatistics;
exports.downloadFile = downloadFile;
exports.getCachedFile = getCachedFile;