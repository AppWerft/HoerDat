const Settings = require('controls/settings');

const RTM = require("ti.ringtonemanager");

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 50
    });
    $.add(Ti.UI.createLabel(Settings.styles));
    $.children[0].text = "Sound";
    var Picker = Ti.UI.createPicker({
        right : 5
    });
    setTimeout(function() {
        Picker.add(RTM.getAllRingtones(RTM.TYPE_ALL).map(function(tone) {
            return Ti.UI.createPickerRow({
                title : tone.title,
                uri : tone.uri
            });
        }));
    }, 2000);
    $.add(Picker);
    $.children[1].addEventListener("change", e => {
        RTM.playRingtone(e.row.uri);
        Settings.set("CALENDAR_RINGTONE",e.row.uri); 
        //Settings.set("CALENDAR_SOUND", e.value);
    });
    return $;
};
