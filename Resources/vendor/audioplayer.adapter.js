/* Init */
/*https://github.com/vbartacek/aacdecoder-android/blob/master/decoder/src/com/spoledge/aacdecoder/IcyInputStream.java#L98-L112
 */
const AudioNotification = require("de.appwerft.audionotification"),
    Favs = require('controls/favs'),
    Player = Ti.Media.createAudioPlayer();

var Notification;

const TICK = 3000;
var logo;

var currentStatus = 0;
var wasLastPingSuccessful = false;
var audioSessionId;

function LOG() {
    console.log('🛠AAS: ' + arguments[0]);
}

var shouldPlay = null;
// null or URL (string)
var shouldStopp = false;
// true or false

const STOPPED = 5,
    STOPPING = 6,
    WAITING_FOR_DATA = 7,
    WAITING_FOR_QUEUE = 8,
    BUFFERING = 0,
    INITIALIZED = 1,
    PAUSED = 2,
    PLAYING = 3,
    STARTING = 4,
    OFFLINE = 5,
    STATUS = ['BUFFERING', 'INITIALIZED', 'PAUSED', 'PLAYING', 'STARTING', 'STOPPED', 'STOPPING', 'WAITING_FOR_DATA', 'WAITING_FOR_QUEUE', 'STREAMERROR', 'TIMEOUT', 'OFFLINE'];

/*
 * is callback function with payload: String message Integer status ['STOPPED',
 * 'BUFFERING', 'PLAYING', 'STREAMERROR']
 */
var callbackFn;
function onPlayerComplete() {
    currentStation.onCompleted && currentStation.onCompleted();
    Notification && Notification.stop();
}

function onProgress(_e) {

    currentStation.onProgress && _e && currentStation.onProgress(_e.progress);

}

function onPlayerChange(_e) {
    var status = _e.state;
    Ti.UI.createNotification({
        message : _e.description,
        duration : 200
    }).show();
    if (status == PLAYING)
        Favs.increment(currentStation.station);
    if (!Ti.Network.online) {
        // status = STATUS[OFFLINE];
        /*      Ti.UI.createNotification({
         message : "Probleme mit der Internetverbindung",
         duration : 200
         }).show();*/
    }
    currentStation.onChanged && currentStation.onChanged(_e.state);
    if (status == currentStatus)
        return;
    currentStatus = status;
    LOG("Status –––>" + STATUS[status]);

    ;
}

Player.addEventListener('ready', function(_e) {
    if (callbackFn && typeof callbackFn == 'function')
        callbackFn({
            audioSessionId : _e.audioSessionId
        });
});

Player.addEventListener('change', onPlayerChange);
Player.addEventListener('complete', onPlayerComplete);
Player.addEventListener('progress', onProgress);

var currentStation = {};

exports.init = function(lifecycleContainer, icon) {
    Notification = AudioNotification.createNotification({
        lifecycleContainer : lifecycleContainer,
        icon : icon
    });
};

exports.play = function(station, onChanged, onCompleted, onProgress) {
    currentStation.onChanged = onChanged;
    currentStation.onCompleted = onCompleted;
    currentStation.onProgress = onProgress;
    currentStation.title = station.title;
    currentStation.station = station.station;
    currentStation.url = station.url;
    currentStation.largeIcon = station.logo;

    if (currentStation.url != undefined && typeof currentStation.url == 'string') {
        if (Notification) {
            LOG('STATIONTITLE:' + currentStation.title);
            Notification.setTitle(currentStation.title);
            Notification.setSubtitle("");
            // old stuff remove
            Notification.setLargeIcon(currentStation.largeIcon);
            Notification.start();
        }
        shouldPlay = currentStation.url;
        // Player.stop();
        if (Player.isPlaying()) {
            LOG('was playing => forced stopp');
            shouldStop = true;
            Player.stop();
        } else {
            LOG(currentStation.url);
            Player.url = currentStation.url;
            Player.start();
        }
    } else
        LOG("something wrong with URL " + currentStation.url);
};

function stopStream() {
    if (Notification)
        Notification.stop();
    LOG('≠≠≠≠≠≠≠ STOP method');
    shouldPlay = null;
    setTimeout(function() {
        if (callbackFn && typeof callbackFn == 'function')
            callbackFn({
                status : 'STOPPED',
            });

        shouldStopp = false;
    }, 100);
    shouldStopp = true;
    Player.stop();
    Player.release();
}

exports.stop = stopStream;

Ti.App.addEventListener('stopRadio', stopStream);

exports.isPlaying = function() {
    return Player.isPlaying();
};
exports.isStopped = function() {
    return !Player.isPlaying() && !Player.isPaused();
};
exports.isOnline = function() {
    return wasLastPingSuccessful;
};

/* every click */
/*
 * var watchDog = setInterval(function() {
 *
 * if (shouldPlay != null) requestOnlinestate(function() { }); // set module
 * variable wasLastPingSuccessful }, TICK);
 */
