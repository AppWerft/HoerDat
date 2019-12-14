const Settings = require('controls/settings');
const RTM = require("ti.ringtonemanager");

module.exports = function() {
    const $ = Ti.UI.createTableViewRow({
        height : 90
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
    setTimeout(function() {
        const selectedUri = Settings.get("CALENDAR_RINGTONE");
        var selectedIndex = -1;
        pickerView.opacity = 1;
        pickerView.add(RTM.getAllRingtones(RTM.TYPE_NOTIFICATION).map(function(Ringtone, ndx) {
            if (selectedUri == Ringtone.getUri())
                selectedIndex = ndx;
            return Ti.UI.createPickerRow({
                title : Ringtone.getTitle(),
                uri : Ringtone.getUri(),
                ringtone : Ringtone
            });
        }));
        pickerView.setSelectedRow(0, selectedIndex);
    }, 800);
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
    });
    return $;
};
