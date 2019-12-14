const Settings = require('controls/settings');

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 70
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Notifikation bleibt Minuten nach dem Start";
    $.add(Ti.UI.createTextField({
        right : 10,
        width : 50,
        height : 40,
        font : {
            fontSize : 16
        },
        color : '#666',
        textAlign : 'right',
        inputType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
        value : Settings.get("CALENDAR_AFTER")
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set("CALENDAR_AFTER", e.value);
    });
    return $;
};
