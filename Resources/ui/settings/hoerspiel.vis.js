const Settings = require('controls/settings');

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 70
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Hörspielplayer mit Animation";
    $.add(Ti.UI.createSwitch({
        right : 10,
        value : Settings.get("HOERSPIEL_VIS")
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set("HOERSPIEL_VIS", e.value);
    });
    return $;
};
