var service = Ti.Android.currentService;

var id = service.serviceInstanceId;
var intent = service.intent;
var message = intent.getStringExtra("parameter");
