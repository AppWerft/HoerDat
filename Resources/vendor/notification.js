const channel = Ti.Android.NotificationManager.createNotificationChannel({
	id : 'hd',
	name : 'Hördat',
	sound : Ti.Filesystem.resRawDirectory + 'silence.mp3',
	importance : Ti.Android.IMPORTANCE_DEFAULT
});
var notification;
var station;
var logo;

exports.create = function(_station, logo) {
	station = _station;
	console.log(logo.toLowerCase().replace(' ',''));
	notification = Ti.Android.createNotification({
		icon : Ti.App.Android.R.drawable.applogo, //Ti.Android.R.drawable.ic_dialog_info,
		contentTitle : station,
		contentText : ' 🔉 📻 ',
		largeIcon : Ti.App.Android.R.drawable[logo.toLowerCase().replace(' ','')],
		channelId : channel.getId(),
		visibility : Ti.Android.VISIBILITY_PUBLIC,
		number : 5,
	//	style : Ti.Android.BigPictureStyle,
		when : new Date().getTime(),
		contentIntent : Ti.Android.createPendingIntent({
			intent : Ti.Android.createIntent({})
		})
	});
	if (notification)Ti.Android.NotificationManager.notify(1, notification);
};

exports.update = function(message) {
	notification.setLatestEventInfo(station, message, notification.contentIntent);
	Ti.Android.NotificationManager.notify(1, notification);
};

exports.remove = function() {
	Ti.Android.NotificationManager.cancel(1);
};
