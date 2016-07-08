(function() {
	var Window = require('ui/handheld/ApplicationWindow');
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Window).open();
	var metaModule = require("de.appwerft.icystreammeta");
	var metaClient = metaModule.createIcyMeta({
		url : "http://hr-mp3-m-h2.akacast.akamaistream.net/7/786/142132/v1/gnl.akacast.akamaistream.net/hr-mp3-m-h2",
		onload : function(_e) {
			console.log(_e);
		},
		onerror : function(_e) {
			console.log(_e);
		}
	});
	setInterval(function() {
		metaClient.refreshMeta();
	}, 15000);
	/*
	 var PayPal = require('ti.paypal');
	 PayPal.initialize({
	 clientIdSandbox : "access_token$sandbox$kjkkxsys9jzzfmzs$108e66b2d2c8007e75f6f66f44e7f667",
	 clientIdProduction : "<YOUR_CLIENT_ID_PRODUCTION>",
	 environment : PayPal.ENVIRONMENT_SANDBOX // or: ENVIRONMENT_PRODUCTION
	 });
	 var item1 = PayPal.createPaymentItem({
	 name : "My item",
	 price : 23.99,
	 sku : "my-item",
	 quantity : 1,
	 currency : "USD"
	 });
	 var configuration = PayPal.createConfiguration({
	 merchantName : "John Doe",
	 merchantPrivacyPolicyURL : "http://google.com",
	 merchantUserAgreementURL : "http://google.com",
	 locale : "en" // Any ISO 639-1
	 });
	 var payment = PayPal.createPayment({
	 configuration : configuration,
	 currencyCode : "USD",
	 amount : 23.99, // Has to match the amount of your items if you set them
	 shortDescription : "Your shopping trip at FooBar",
	 intent : PayPal.PAYMENT_INTENT_SALE, // or: PAYMENT_INTENT_AUTHORIZE, PAYMENT_INTENT_ORDER
	 items : [item1]
	 });*/
})();
