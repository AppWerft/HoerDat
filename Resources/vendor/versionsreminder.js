function str2int(foo) {
    var parts = foo.split('.');
    return 100000 * parts[0] + 1000 * parts[1] + parts[2];
}

module.exports = function() {
    var e = (arguments[0] || {}, "https://play.google.com/store/apps/details?id=" + Ti.App.getId()),
        t = Ti.Network.createHTTPClient({
        onload : function() {
            var t = /itemprop="softwareVersion">(.*?)</m.exec(this.responseText);
            
            if (t && str2int(( version = t[1].replace(/\s+/g, ""))) > str2int(Ti.App.getVersion())) {
                var r = Ti.UI.createAlertDialog({
                    cancel : 1,
                    buttonNames : ["Zum Store", "Abbruch"],
                    message : "Es gibt eine neue Version im Playstore.\n\nDiese App auf dem " + Ti.Platform.model + ' hat die Version ' + Ti.App.getVersion() + "\n\nIm Store ist  " + version + ".\n\nMöchtest Du erneuern?",
                    title : "Neue Version „" + Ti.App.getName() + "“"
                });
                r.addEventListener("click", function(t) {
                    t.index != t.source.cancel && Ti.Platform.openURL(e);
                }), r.show();
            } else
                Ti.Android && Ti.UI.createNotification({
                    message : Ti.App.getName() + " ist in neuester Version (" + Ti.App.getVersion() + ")"
                }).show();
        }
    });
    t.open("GET", e), t.send();
};
