const Settings = require('controls/settings'),
    RTM = require("ti.ringtonemanager"),
    MIN = 55,
    MAX = 90;

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : MIN
    });
    var count = 0;
    const labelView = Ti.UI.createLabel(Settings.styles)
    labelView.top = 15;
    $.add(labelView);
    $.children[0].text = "Benachrichtigung mit Geräusch";
    const switchView = Ti.UI.createSwitch({
        right : 10,
        top : 15,
        value : Settings.get("CALENDAR_SOUND")
    });
    $.add(switchView);
    const pickerView = Ti.UI.createPicker({
        top : 60,
        right : 5,
        opacity : 0.1
    });
    const selectedUri = Settings.get("CALENDAR_RINGTONE");
    var selectedIndex = -1;
    const renderRow = (Ringtone, ndx) => {
        if (selectedUri == Ringtone.getUri())
            selectedIndex = ndx;
        return Ti.UI.createPickerRow({
            title : Ringtone.getTitle(),
            ringtone : Ringtone
        });
    }
    setTimeout(() => {
        pickerView.opacity = 1;
        RTM.getAllRingtones(RTM.TYPE_NOTIFICATION, function(res) {
            pickerView.add(res.ringtones.map((ringtone,ndx) => {
                return renderRow(ringtone, ndx);
            }));
        });
        pickerView.setSelectedRow(0, selectedIndex);
        $.height = Settings.get("CALENDAR_RINGTONE") ? MAX : MIN;
    }, 500);
    $.add(pickerView);

    pickerView.addEventListener("change", e => {
        if (count) {
            const Ringtone = e.row.ringtone;
            Ringtone.play();
            Settings.set("CALENDAR_RINGTONE", Ringtone.getUri());
        }
        count++;
    });
    switchView.addEventListener("change", e => {
        Settings.set("CALENDAR_SOUND", e.value);
        $.height = e.value ? MAX : MIN;
    });
    return $;
};
