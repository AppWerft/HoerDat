const Settings = require('controls/settings');

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 70
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Notifikation erscheint Minuten vor dem Termin";
    $.add(Ti.UI.createTextField({
        right : 10,
        width : 50,
        height : 40,
        color : '#666',
        font : {
            fontSize : 16
        },
        inputType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
        textAlign : 'right',
        value : Settings.get("CALENDAR_BEFORE")
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set("CALENDAR_BEFORE", e.value);
    });
    return $;
};
