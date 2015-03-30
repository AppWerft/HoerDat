var service = Ti.Android.currentService;

var id = service.serviceInstanceId;
var intent = service.intent;
var message = intent.getStringExtra("parameter");
console.log(intent);
console.log(service);
Ti.API.info("Hello World!  I am a Service.  I have this to say: " + message + '    '+ id);