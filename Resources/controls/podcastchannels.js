const DB = 'PODCASTS2';
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

(function init() {
	const link = Ti.Database.open(DB);
	const sql = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,
			'model', 'podcasts.sql').read().text;
	sql.split(/;/mg).forEach(function(stmt) {
		stmt = stmt.replace(/\n/gm, '') + ';';
		link.execute(stmt);
	});
	link.close();
})();

const getChannelByUrl = function(channelurl, onReady) {
	console.log("getChannelByUrl");
	onReady(_getChannelByUrl(channelurl));
	console.log("loadChannelByUrl");
	_loadChannelByUrl(channelurl, onReady);
};

function _getChannelByUrl(channelurl) {
	const start = new Date().getTime();
	var res = [];
	var link = Ti.Database.open(DB);
	if (link) {
		const sql = 'SELECT image,duration,position,title,author,id,url,description,lastaccess,state FROM items WHERE channelurl=? ORDER BY lastaccess DESC';
		const found = link.execute(sql, channelurl);
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
				lastaccess : found.field(8),
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
		return {item:res};
	} else {
		console.log("cannot link DB");
		return {item:[]};
	}
}

function _loadChannelByUrl(channelurl, onLoad) {
	console.log("🏁 loadRSS " + channelurl);
	require("de.appwerft.podcast")
			.loadPodcast(
					{
						url : channelurl,
						timeout : 10000,
						userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
					},
					function(_e) {
						
						const channel= _e.channel;
						if (!channel.item) {
							console.log("server not responding " + channelurl);
							return;
						}
						var link = Ti.Database.open(DB);
						link.execute("UPDATE channels SET description=?,image=?WHERE channelurl=?",channel.description,channel.image,channelurl);
						
						var count = 0;
						if (link) {
							link.execute("BEGIN TRANSACTION");
							channel.item.forEach(function(item) {
								_insertOrUpdateItem(link, channelurl, item);
								count++;
							});
							link.execute("COMMIT");
							link.close();
						} else
						console.log(count + " datasets updated/inserted "
								+ channelurl);
						const result= _getChannelByUrl(channelurl);
						console.log(result);
						onLoad(result);
					});
}

function _insertOrUpdateItem(_link, _channelurl, _item) {
	const channelurl = _channelurl;
	function parseHTML(foo) {
		var bar = {};
		var img = RegExp('src="([^"]+)', 'gmi').exec(foo);
		if (img && img.length > 1) {
			bar.image = img[1];
		}
		var d = RegExp('<img.*?\/>([^<]+)', 'gmi').exec(foo);
		if (d && d.length > 1) {
			bar.description = d[1];
		}
		return (bar !={})?bar : null;
	}
	const item = {
		author : "",
		weblink : _item.link,
		title : _item.title,
		image : _item.image || parseHTML(_item.description).image,
		description : parseHTML(_item.description).description
				|| _item.description.replace('<p>','').replace('</p>','') || "",
		url : _item.enclosure.url,
		duration : (function(duration) {
			if (duration) {
				return 1000 * hmsToSecondsOnly(duration)
			} else {
				return 0;
			}
		})(_item.duration)
	};
	const found = _link.execute('SELECT * from items where url=?', item.url);
	if (found.isValidRow()) {
		found.close();
		_link
				.execute(
						"update items set channelurl=?,description=?,image=?,duration=?,author=?, title=? where url=?",
						channelurl, item.description, item.image,
						item.duration, item.author, item.title, item.url);
		console.log("W=" + item.title + ' ' + _link.rowsAffected);

	} else {
		_link
				.execute(
						"insert into items (channelurl, author, weblink,title,description,image,url,duration,lastaccess,state,pubdate) values (?,?,?,?,?,?,?,?,?,?,?)",
						channelurl, item.author, item.weblink, item.title,
						item.description, item.image, item.url, item.duration,
						Math.round(new Date().getTime() / 1000), 0,
						item.pubDate);
	}
	return true;
}

const getChannelsByStation = function(station, onload) {
	console.log("======================getChannelsByStation");
	const link = Ti.Database.open(DB);
	const cursor = link
			.execute(
					'SELECT template,title,channelurl,image,description FROM channels WHERE station=?',
					station);
	var channels = [];
	while (cursor.isValidRow()) {
		channels.push({
			template : cursor.field(0),
			title : cursor.field(1),
			url : cursor.field(2),
			image : cursor.field(3),
			description : cursor.field(4),

		});
		cursor.next();
	}
	cursor.close();
	link.close();
	if (channels.length) {
		console.log("Usage of cached channellist " + station);
		onload(channels);
		return;
	}
	function onChannelListLoad(res) {
		console.log(res	);
		const template = res.template;
		const link = Ti.Database.open(DB);
		link.execute('DELETE FROM channels WHERE station=?', station);
		res.items
				.forEach(function(channel) {
					res.items.template = template;
					link
							.execute(
									"INSERT INTO channels (station,template,channelurl,title,image) VALUES (?,?,?,?,?)",
									station, template, channel.url,
									channel.title, channel.image);

				});
		link.close();
		onload(res.items);
	}
	;
	require('controls/podcasts/' + station)(onChannelListLoad);
};

exports.getChannelByUrl = getChannelByUrl;
exports.getChannelsByStation = getChannelsByStation;
