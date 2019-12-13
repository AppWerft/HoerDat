var Moment = require('vendor/moment');
Moment.locale('de');
const DB = 'Alarms2';
var link = Ti.Database.open(DB);
link.execute('CREATE TABLE IF NOT EXISTS "alarms" ("start" NUMBER, "meta" VARCHAR, "enabled" INTEGER, "reqcode" NUMBER, "id" VARCHAR)');
const p = link.execute("SELECT * FROM 'alarms' LIMIT 0,1 ; ");
link.close();

const AM = require('bencoding.alarmmanager');
AM.enableLogging();

const alarmManager = AM.createAlarmManager();
const TIME_BEFORE = 15*60, TIME_AFTER=30*60;


const getCode = foo => parseInt(Ti.Utils.md5HexDigest(foo).replace(/[\D]/g, '').substr(0, 10));

const addAlarm = meta => {
    //console.log(alarmManager.findStartActivityName());
    const sendung = JSON.parse(meta);

    const link = Ti.Database.open(DB);
    const id = Ti.Utils.md5HexDigest(meta);
    const requestCode = getCode(meta);
    link.execute("INSERT INTO alarms VALUES (?,?,?,?,?)", //
    sendung.start, meta, 1, requestCode, Ti.Utils.md5HexDigest(meta));
    link.close();
    const start = Moment(sendung.start).unix();
    const now = Moment().unix();
    var diff = start - now;
    if (diff > TIME_BEFORE)
        diff -= (TIME_BEFORE);
    // 15 min before

    const alarmopts = {
        contentText : sendung.title || 'Titel der Sendung',
        contentTitle : sendung.sender + "  "+Moment(sendung.start).format('hh:mm') + ' Uhr',
        now : Moment(sendung.start).format('hh:mm'),
        requestCode : requestCode,
        icon : Ti.App.Android.R.drawable.wecker_active,
        playSound : true,
        priority : AM.PRIORITY_HIGH,
        visibility : AM.PUBLIC,
        importance : AM.NOTIFICATION_IMPORTANCE_HIGHT,
        badegeIconType : AM.BADGE_ICON_LARGE,
        sound : Ti.App.Android.R.raw.kkj,
        largeIcon : sendung.stationlogo, //Ti.App.Android.R.drawable.wecker_active,//
        when : TIME_BEFORE, // 15 min davor
        vibrate : true,
        group : requestCode,
        ongoing : true,
        showLights : true,
       
        timeoutAfter : diff + TIME_AFTER, // 30 min
        second : 5,//diff,
        autoCancel : false,
        onlyAlertOnce : false
       
    };
    var station =require('controls/favs').getByName(sendung.sender.toLowerCase().replace(' ',''));
    if (station) {
        alarmopts.actions= [{
            icon: Ti.App.Android.R.drawable.wecker_active,
            actionname : 'START_RADIO',
            label : 'Radiostart',
            extradata: JSON.stringify(station)
        }];
    }
    alarmManager.addAlarmNotification(alarmopts);
};

const isActive = meta => {
    var active = false;
    const link = Ti.Database.open(DB);
    const c = link.execute("SELECT id FROM alarms WHERE id=?", Ti.Utils.md5HexDigest(meta));
    active = !!c.isValidRow();
    c.close();
    link.close();
    return active;
};

const removeAlarm = meta => {
    const reqcode = getCode(meta);
    var link = Ti.Database.open(DB);
    link.execute("DELETE FROM alarms WHERE id=?", Ti.Utils.md5HexDigest(meta));
    link.close();
    alarmManager.cancelAlarmNotification(reqcode);
};

const listAll = () => {
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

