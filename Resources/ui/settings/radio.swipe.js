const Settings = require('controls/settings');

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 70
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Radioplayer wird mit senkrechtem Wischen beenden";
    $.add(Ti.UI.createSwitch({
        right : 10,
        value : Settings.get("RADIO_SWIPE")
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set("RADIO_SWIPE", e.value);
    });
    return $;
};
