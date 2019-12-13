

module.exports = function(e) {
    const intent = (e.intent) ? e.intent : Ti.Android.currentActivity.getIntent();
    if (intent && intent.action == 'START_RADIO') {
        if (intent.hasExtra("extradata")) {
            const sender = JSON.parse(intent.getStringExtra("extradata"));
            RadioPlayer($, sender, null).open();
        } else
            console.log("Extradata are missing");
    }
};
