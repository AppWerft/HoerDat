const Settings = require('controls/settings');

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 70
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Notifikation mit Vibration";
    $.add(Ti.UI.createSwitch({
        right : 10,
        value : Settings.get("CALENDAR_VIBRATION")
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set("CALENDAR_VIBRATION", e.value);
    });
    return $;
};
