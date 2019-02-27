/* Init */
/*https://github.com/vbartacek/aacdecoder-android/blob/master/decoder/src/com/spoledge/aacdecoder/IcyInputStream.java#L98-L112
 */
const StreamingPlayer = require("com.woohoo.androidaudiostreamer");
const AudioNotification = require("de.appwerft.audionotification");

var Notification;

const TICK = 3000;
var logo;

var currentStatus = 0;
var wasLastPingSuccessful = false;
var audioSessionId;

function LOG() {
	console.log('AAS: ' + arguments[0]);
}

function requestOnlinestate(_cb) {
	_cb && _cb(Ti.Network.online);
	/*
	 if (Ti.Network.online == false) {
	 LOG("Ti.Network.online false");
	 wasLastPingSuccessful = false;
	 _cb && _cb(false);
	 } else {
	 var xhr = Ti.Network.createHTTPClient({
	 timeout : TICK,
	 onload : function() {
	 if (xhr.status == 301) {
	 console.log("FB PING successful");
	 wasLastPingSuccessful = true;
	 _cb && _cb(true);
	 } else {
	 wasLastPingSuccessful = false;
	 _cb && _cb(false);
	 }
	 },
	 onerror : function() {
	 wasLastPingSuccessful = false;
	 _cb && _cb(false);
	 }
	 });
	 xhr.setAutoRedirect(false);
	 xhr.open('HEAD', 'https://facebook.com/'), xhr.send();
	 }*/
}

var shouldStream = null;
// null or URL (string)
var shouldStopp = false;
// true or false

const STOPPED = 0,
    BUFFERING = 1,
    PLAYING = 2,
    STREAMERROR = 3,
    TIMEOUT = 4,
    STATUS = ['STOPPED', 'BUFFERING', 'PLAYING', 'STREAMERROR', 'TIMEOUT'];

/* is callback function with payload:
 * String message
 * Integer status  ['STOPPED', 'BUFFERING', 'PLAYING', 'STREAMERROR']
 */
var callbackFn;

function onPlayerChange(_e) {
	var status = _e.status;
	if (status == currentStatus)
		return;
	currentStatus = status;
	switch (status) {
	case BUFFERING:
		if (callbackFn && typeof callbackFn == 'function')
			callbackFn({
				status : 'BUFFERING'
			});

		break;
	case PLAYING:
		if (callbackFn && typeof callbackFn == 'function')
			callbackFn({
				status : 'PLAYING'
			});

		break;
	case STOPPED:
		LOG('event STOPPED FROM streamer');
		if (!shouldStopp) {
			LOG('stopping by offline');
			StreamingPlayer.stop();
		}

		shouldStopp = false;

		if (shouldStream && Ti.Network.online) {

		}
		if (callbackFn && typeof callbackFn == 'function')
			callbackFn({
				status : 'STOPPED',
			});

		break;
	case STREAMERROR:
		if (callbackFn && typeof callbackFn == 'function') {
			callbackFn({
				status : 'STREAMERROR'
			});
			L('LOST_CONNECTION_TOAST') && Ti.UI.createNotification({
				message : L('LOST_CONNECTION_TOAST')
			}).show();
		}

		break;
	};
}

function onMetaData(_e) {
	var message = _e.title;
	Notification.setSubtitle(message);
	Notification.update();
	if (callbackFn && typeof callbackFn == 'function')
		callbackFn({
			message : message,
			status : 'PLAYING'
		});
	else
		console.log('wrong callback var type ' + typeof callbackFn);
}

StreamingPlayer.addEventListener('ready', function(_e) {
	if (callbackFn && typeof callbackFn == 'function')
		callbackFn({
			audioSessionId : _e.audioSessionId
		});
});
StreamingPlayer.addEventListener('metadata', onMetaData);
StreamingPlayer.addEventListener('change', onPlayerChange);

var currentStation = {};
exports.init = function(lifecycleContainer, icon) {
	Notification = AudioNotification.createNotification({
		lifecycleContainer : lifecycleContainer,
		icon : icon
	});
};

exports.play = function(station, _callbackFn) {
	currentStation.title = station.title;
	currentStation.url = station.url;
	currentStation.largeIcon = station.logo;
	AudioNotification.getAudioRoutes();
	
	
	callbackFn = _callbackFn;
	if (currentStation.url != undefined && typeof currentStation.url == 'string') {
		if (Notification) {
			Notification.setTitle(currentStation.title);
			Notification.setLargeIcon(currentStation.largeIcon);
			Notification.show();
		}
		LOG('try to stop');
		shouldStream = currentStation.url;
		StreamingPlayer.stop();
		LOG('status after start method = ' + STATUS[StreamingPlayer.getStatus()]);
		if (StreamingPlayer.getStatus() == PLAYING) {
			LOG('was playing => forced stopp');
			shouldStop = true;
			StreamingPlayer.stop();
		} else {
			requestOnlinestate(function(_online) {
				if (_online == true) {
					LOG('was online => try start');
					StreamingPlayer.play(currentStation.url);
					LOG('PLAY STARTED with ' + currentStation.url);
				} else {
					LOG("requestOnlinestate was offline");
					callbackFn({
						status : 'OFFLINE'
					});
				}
			});
		}
	}
};

exports.stop = function() {
	if (Notification)
		Notification.remove();
	LOG('≠≠≠≠≠≠≠ STOP');
	shouldStream = null;
	shoudStopp = true;
	StreamingPlayer.stop();
};

exports.isPlaying = function() {
	return StreamingPlayer.getStatus() == PLAYING ? true : false;
};

exports.isOnline = function() {
	return wasLastPingSuccessful;
};

/* every click */
/*
 var watchDog = setInterval(function() {

 if (shouldStream != null)
 requestOnlinestate(function() {
 });
 // set module variable wasLastPingSuccessful
 }, TICK);
 */
