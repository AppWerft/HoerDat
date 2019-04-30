const DB = 'Pool4';
const STATE_ONLINE = 0, STATE_PROGRESS = 1, STATE_SAVED = 2;
const Downloader = require("de.appwerft.downloadmanager");
const Moment  = require('vendor/moment');

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
addColumn(DB, "pool", "sender", "VARCHAR");


function stripFilename(originalUrl) {
	if (originalUrl) {
		const ndx = originalUrl.lastIndexOf('/');
		const filename = originalUrl.substring(ndx + 1).replace(/\?assetId=(.*)/g,''); 
		console.log(filename);
		return filename;
	}
	return null;
}

const getCachedFile = function(originalUrl) {
	const file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,
			stripFilename(originalUrl));
	return file.exists ? file : null;
};


function removeDownload(id) {
	const link = Ti.Database.open(DB);
	link.execute('UPDATE pool SET state=? WHERE id=?',
			STATE_ONLINE,id);
	link.close();
	
	const count = Downloader.removeDownloadById(id);
	Ti.App.fireEvent('renderPool',{});
}

function setStateToProgress(localfile, id, url) {
	console.log('>>>> setStateToProgress');
	console.log(id + '   file='+localfile);
	const link = Ti.Database.open(DB);
	
	link.execute('UPDATE pool SET id=?,state=?,localfile=? WHERE url=?',
			id, STATE_PROGRESS, stripFilename(localfile), url);
	console.log("rowsAffected: "+link.rowsAffected);
	link.close();

}


function getStorageStatistics() {
	var toHHMMSS = (secs) => {
	    let sec_num = parseInt(secs, 10)    
	    let hours   = Math.floor(sec_num / 3600);
	    let minutes = Math.floor(sec_num / 60) % 60
	    let seconds = sec_num % 60    
	    return [hours,minutes,seconds]
	        .map(v => v < 10 ? "0" + v : v)
	        .filter((v,i) => v !== "00" || i > 0)
	        .join(":");
	}
	var result =  Downloader.getStorageStatistics();
	var link = Ti.Database.open(DB);
	if (link) {
		var curs;
		var val;
		curs = link.execute('SELECT count(*) AS total FROM pool');
		if  (curs.isValidRow() == true) {
			result.counttotal = curs.field(0);
		}
		curs.close();
		curs = link.execute('SELECT count(*) AS total FROM pool WHERE state=?',STATE_SAVED);
		if  (curs.isValidRow() == true) {
			result.countlocal = curs.field(0);
		}
		curs.close();
		curs = link.execute('SELECT SUM(duration/1000) AS total FROM pool');
		if  (curs.isValidRow() == true) {
			val = curs.field(0);
			result.durationtotal = toHHMMSS(val);
		}
		curs.close();
		curs = link.execute('SELECT SUM(duration/1000) AS total FROM pool WHERE state=?',STATE_SAVED);
		if  (curs.isValidRow() == true) {
			val = curs.field(0);
			result.durationlocal = toHHMMSS(val);
		}
		curs.close();
		curs = link.execute('SELECT SUM(position/1000) AS total FROM pool WHERE state=?',STATE_SAVED);
		if  (curs.isValidRow() == true) {
			result.progresslocal = toHHMMSS(curs.field(0));		}
		curs.close();
		link.close();
	}
	return result;
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
		const cursor = link.execute('SELECT position FROM pool WHERE url=?',url);
		if (cursor.isValidRow() == true) {
			position = cursor.field(0);
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
		link.execute("UPDATE pool set position=?,faved=? WHERE url=?", position, new Date().getTime(), url);
		link.close();
	} else
		console.log("no link to DB");
};



const getAll = function(state, inprogress) {
	const start = new Date().getTime();
	var res = [];
	var link = Ti.Database.open(DB);
	var where = ' WHERE 1=1 ';
	if (link) {
		where += ((state == undefined ? '' : 'AND  state=' + parseInt(state)));
		if (inprogress != undefined) {
			where += (inprogress == true ? ' AND position>0'
				: ' AND (position IS NULL OR position=0)');
		}
		const sql = 'select image,duration,position,title,author,id,url,description,faved,state from pool ' + where + ' ORDER BY faved DESC';	
		const found = link.execute(sql);
		while (found.isValidRow() == true) {
			const duration = parseInt(found.field(1) || 1000*60*60); // ms.
			const position = parseInt(found.field(2) || 0); // ms
			const image = found.field(0);
			res.push({  image : image ? image.replace('jpeg?w=1800', 'jpeg?w=200') : '/images/defaultmage.png',
						title : found.field(3),
						author : found.field(4),
						position : position,
						id: found.field(5),
						url : found.field(6),
						description : found.field(7),		
						faved : found.field(8),
						state : found.field(9),
						duration : duration,
						progress : position / duration,
						durationstring : isNaN(duration) ? "":new Date(duration).toISOString().substr(11, 8),
						positionstring : isNaN(position) ? "":new Date(position).toISOString().substr(11, 8),
						duration : duration,
						position : position,
						
					});
			found.next();
		}
		found.close();
		link.close();
	}
	return res;
};

const syncWithRSS = function(onReady) {
	const now = new Date().getTime()/1000;
	if (now - Ti.App.Properties.getDouble("TIMESTAMP_OF_LAST_SYNC",0.0)<3600) {
		onReady();
		return;
	}
	const FEEDS = require('model/hoerspielfeeds');
	var numberOfNewItems = 0;
	var count = FEEDS.length;
	/* start native HTTPClient: */
	FEEDS.forEach(function(feed) {
				var sender = feed.id;
				var start = new Date().getTime();
				require("de.appwerft.podcast")
						.loadPodcast(
								{
									url : feed.url,
									timeout : 10000,
									userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
								},
								function(_e) {
									if (!_e.items) return;
									Ti.App.Properties.setDouble("TIMESTAMP_OF_LAST_SYNC",new Date().getTime()/1000);
									numberOfNewItems += _e.items.length;
									console.log(sender+ " DL: " + (new Date().getTime()-start));
									start=new Date().getTime();
									var link = Ti.Database.open(DB);
									if (link) {
										link.execute("BEGIN TRANSACTION");
										_e.items.forEach(function(item) {
											insertOrUpdateItem(item, link, feed);
										});
										link.execute("COMMIT");
										link.close();
									}
									console.log(sender+ " DBwork" + (new Date().getTime()-start));
									count--;
									if (count==0)
										onReady();
								});
			});
};

function insertOrUpdateItem(_item, _link,_feed) {
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
	// special case DLF:
	// HTML as CDATE inside description:
	if (_item.description && _item.description.substr(0,1)=='<') {
		var img  = RegExp('src="([^"]+)','gmi').exec(_item.description);
		if (img &&img.length>1) {
			_item.image = img[1];
		}
		var d  = RegExp('<img.*?\/>([^<]+)','gmi').exec(_item.description);
		if (d && d.length>1) {
			_item.description = d[1];
		}
	} 
	var defaultImage = _feed.logo;
	const item = {
		author : author,
		weblink : _item.link,
		title : title,
		image : _item.image || defaultImage,
		description : _item.description || "",
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
		_link.execute("update pool set description=?,image=?,duration=?,author=?, title=? where url=?",
				item.description,item.image,item.duration,item.author, item.title, item.url);

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

const File = (url) => {
	const file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,
			stripFilename(url));
	return file.exists ? file : null;
};

Downloader.onComplete = function(e){
	syncWithDownloadManager();
	Ti.App.fireEvent('renderPool',{});
};
Downloader.onDone =function(e){
	console.log(e);
	Ti.App.fireEvent('renderPool',{});
};


const downloadFile = function(originalUrl, title) {
	const filename = stripFilename(originalUrl), file = Ti.Filesystem.getFile(
			Ti.Filesystem.externalStorageDirectory, filename);
	/*
	 * Pifall: this url is not equal the url of getDownloads, the manager
	 * resolves the redirects
	 */
	const Request = Downloader.createRequest(originalUrl);
	Request
		.setNotificationVisibility(Request.VISIBILITY_VISIBLE)
		.setDestinationFile(file)
		.setTitle(title)
		.setDescription(filename);
	const id = Downloader.enqueue(Request);
	Downloader.getAllDownloadStates().forEach(function(dl){
		console.log(dl);
	});
	setStateToProgress(filename,id,originalUrl	);
	return true;
};

function syncWithDownloadManager() {
	console.log(":::::::::::::::::::::::::::::::: syncWithDownloadManager");
	var start = new Date().getTime();
	var link = Ti.Database.open(DB);
	if (link) {
		link.execute("BEGIN TRANSACTION");
		Downloader.getAllDownloadStates().forEach(function(dl){
			console.log(dl);
			var state = STATE_ONLINE;
			switch (dl.state) {
				case Downloader.STATUS_SUCCESSFUL: // 8
					state = STATE_SAVED;
				break;
				case Downloader.STATUS_FAILED: // 16
					state = STATE_ONLINE;
				break;	
				case Downloader.STATUS_PAUSED: //4
				case Downloader.STATUS_PENDING: // 1
				case Downloader.STATUS_RUNNING: // 2
					state = STATE_ONLINE;
				break;	
			}
			link.execute('UPDATE pool SET state=?,position=0 WHERE id=?',state,dl.id);
			//const found = link.execute('SELECT state from pool WHERE id=?',dl.id) ;
			 //if (!found.rowCount) Downloader.removeDownloadById(dl.id);
		});
		
		link.execute("COMMIT");
		link.execute("UPDATE `pool` SET state=?,position=0 WHERE id IS NULL",STATE_ONLINE);
		link.close();
		Ti.App.fireEvent('renderPool', {});
	}
	console.log(":::::::::Runtime for syncWithDownloadManager: " + (new Date().getTime()-start));
}

setTimeout(syncWithDownloadManager,1555);

Ti.App.addEventListener('downloadmanager:onComplete', 
		syncWithDownloadManager);

exports.getAll = getAll;
exports.setPosition = setPosition;
exports.getPosition = getPosition;
exports.removeDownload = removeDownload;
exports.syncWithRSS = syncWithRSS;

exports.getStorageStatistics = getStorageStatistics;
exports.downloadFile = downloadFile;
exports.getCachedFile = getCachedFile;
