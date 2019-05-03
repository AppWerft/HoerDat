const DB = 'Pool4';
const STATE_ONLINE = 0, STATE_PROGRESS = 1, STATE_SAVED = 2;
const Downloader = require("de.appwerft.downloadmanager");
const Moment = require('vendor/moment');

const addColumn = function(dbname, tblName, newFieldName, colSpec) {
	var db = Ti.Database.open(dbname);
	var fieldExists = false;
	resultSet = db.execute('PRAGMA TABLE_INFO(' + tblName + ')');
	while (resultSet.isValidRow()) {
		if (resultSet.field(1) == newFieldName) {
			fieldExists = true;
		}
		resultSet.next();
	} // end while
	if (!fieldExists) {
		// field does not exist, so add it
		db.execute('ALTER TABLE ' + tblName + ' ADD COLUMN ' + newFieldName
				+ ' ' + colSpec);
	}
	db.close();
};
function hmsToSecondsOnly(str) {
	str = str.replace(/:$/, '');
	str = str.replace(/^:/, '');
	var p = str.split(':'), s = 0, m = 1;
	while (p.length > 0) {
		s += m * parseInt(p.pop(), 10);
		m *= 60;
	}
	return s;
}

var link = Ti.Database.open(DB);
link
		.execute('CREATE TABLE IF NOT EXISTS "podcasts" ("title" VARCHAR, "author" VARCHAR, "keywords" VARCHAR,"weblink" VARCHAR, "description" VARCHAR, "pubdate" VARCHAR,"depubdate" VARCHAR, "duration" INTEGER,"image" VARCHARs,"position" INTEGER,"url" VARCHAR, "state" INTEGER,"faved" INTEGER, localfile STRING);');

link.close();

addColumn(DB, "pool", "id", "Number");
addColumn(DB, "pool", "sender", "VARCHAR");

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
		const sql = 'select image,duration,position,title,author,id,url,description,faved,state from podcasts '
				+ where + ' ORDER BY faved DESC';
		const found = link.execute(sql);
		while (found.isValidRow() == true) {
			const duration = parseInt(found.field(1) || 1000 * 60 * 60); // ms.
			const position = parseInt(found.field(2) || 0); // ms
			const image = found.field(0);
			res.push({
				image : image ? image.replace('jpeg?w=1800', 'jpeg?w=200')
						: '/images/defaultmage.png',
				title : found.field(3),
				author : found.field(4),
				position : position,
				id : found.field(5),
				url : found.field(6),
				description : found.field(7),
				faved : found.field(8),
				state : found.field(9),
				duration : duration,
				progress : position / duration,
				durationstring : isNaN(duration) ? "" : new Date(duration)
						.toISOString().substr(11, 8),
				positionstring : isNaN(position) ? "" : new Date(position)
						.toISOString().substr(11, 8),
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

const syncWithRSS = function(feed, onReady) {
	;
	const now = new Date().getTime() / 1000;
	if (now - Ti.App.Properties.getDouble("TIMESTAMP_OF_LAST_PODCASTSYNC", 0.0) < 3600) {
		console.log("we save the world and use the cached version");
		onReady();
		return;
	}

	var start = new Date().getTime();
	require("de.appwerft.podcast")
			.loadPodcast(
					{
						url : url,
						timeout : 10000,
						userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
					},
					function(_e) {
						if (!_e.items) {
							console.log("server not responding");
							return;
						}
						Ti.App.Properties.setDouble("TIMESTAMP_OF_LAST_PODCASTSYNC",
								new Date().getTime() / 1000);
						numberOfNewItems += _e.items.length;
						console.log(sender + " DL: "
								+ (new Date().getTime() - start));
						start = new Date().getTime();
						var link = Ti.Database.open(DB);
						if (link) {
							link.execute("BEGIN TRANSACTION");
							_e.items.forEach(function(item) {
								insertOrUpdateItem(item, link, feed);
							});
							link.execute("COMMIT");
							link.close();
						}
						console.log(sender + " DBwork"
								+ (new Date().getTime() - start));
						count--;
						if (count == 0)
							onReady();
					});

};

function insertOrUpdateItem(_item, _link, _feed) {
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
	if (_item.description && _item.description.substr(0, 1) == '<') {
		var img = RegExp('src="([^"]+)', 'gmi').exec(_item.description);
		if (img && img.length > 1) {
			_item.image = img[1];
		}
		var d = RegExp('<img.*?\/>([^<]+)', 'gmi').exec(_item.description);
		if (d && d.length > 1) {
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
	const found = _link
			.execute('select * from podcasts  where url=?', item.url);
	if (found.isValidRow()) {
		found.close();
		_link
				.execute(
						"update pool set description=?,image=?,duration=?,author=?, title=? where url=?",
						item.description, item.image, item.duration,
						item.author, item.title, item.url);

	} else {
		_link
				.execute(
						"insert into podcasts (author, weblink,title,description,image,url,duration,faved,state,pubdate) values (?,?,?,?,?,?,?,?,?,?)",
						item.author, item.weblink, item.title,
						item.description, item.image, item.url, item.duration,
						Math.round(new Date().getTime() / 1000), 0,
						item.pubDate);
	}

}

exports.getAll = getAll;
exports.syncWithRSS = syncWithRSS;
