var Moment = require('vendor/moment');
Moment.locale('de');
const DB = 'Alarms2';
var link = Ti.Database.open(DB);
link.execute('CREATE TABLE IF NOT EXISTS "alarms" ("start" NUMBER, "meta" VARCHAR, "enabled" INTEGER, "reqcode" NUMBER, "id" VARCHAR)');
const p = link.execute("SELECT * FROM 'alarms' LIMIT 0,1 ; ");
link.close();

const alarmManager = require('bencoding.alarmmanager').createAlarmManager();

function getCode(foo) {
	return parseInt(Ti.Utils.md5HexDigest(foo).replace(/[\D]/g, ''));
}

const addAlarm = function(meta) {
	console.log(alarmManager.findStartActivityName());
	const sendung = JSON.parse(meta);
	const link = Ti.Database.open(DB);
	const id = Ti.Utils.md5HexDigest(meta);
	const reqcode = getCode(meta);
	link.execute("INSERT INTO alarms VALUES (?,?,?,?,?)", //
	sendung.start, meta, 1, reqcode, Ti.Utils.md5HexDigest(meta));
	link.close();
	const start = Moment(sendung.start).unix();
	const now = Moment().unix();
	var diff = start - now;
	if (diff > 60 * 15)
		diff -= (60 * 15);
	const alarmopts = {
		contentTitle : sendung.title,
		contentText : 'Bevorstehende Sendung in ' + sendung.sender,
		requestCode : reqcode,
		icon: Ti.App.Android.R.drawable.wecker_active,
		playSound : true,
		vibrate : true,
		showLights : true,
		second : diff
	};
	console.log(alarmopts);
	alarmManager.addAlarmNotification(alarmopts);
};
const isActive = function(meta) {
	var active = false;
	const link = Ti.Database.open(DB);
	const c = link.execute("SELECT id FROM alarms WHERE id=?", Ti.Utils.md5HexDigest(meta));
	active = !!c.isValidRow();
	c.close();
	link.close();
	return active;
};

const removeAlarm = function(meta) {
	const reqcode = getCode(meta);
	var link = Ti.Database.open(DB);
	link.execute("DELETE FROM alarms WHERE id=?", Ti.Utils.md5HexDigest(meta));
	link.close();
	alarmManager.cancelAlarmNotification(reqcode);
};

const listAll = function() {
	var list = [];
	var link = Ti.Database.open(DB);
	const res = link.execute("SELECT meta FROM alarms WHERE start>? ORDER BY start ASC", Moment().format());
	while (res.isValidRow()) {
		list.push(JSON.parse(res.field(0)));
		res.next();
	};
	res.close();
	link.close();
	return list;
};

exports.add = addAlarm;
exports.remove = removeAlarm;
exports.isActive = isActive;
exports.listAll = listAll;

