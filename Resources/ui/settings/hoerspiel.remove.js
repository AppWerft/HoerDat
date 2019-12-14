const Settings = require('controls/settings');

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 70
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Hörspiel wird gelöscht nach „Anhörung“";
    $.add(Ti.UI.createSwitch({
        right : 10,
        value : Settings.get("HOERSPIEL_REMOVE")
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set("HOERSPIEL_REMOVE", e.value);
    });
    return $;
};
