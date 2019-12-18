const DEPOT = "SETTINGS11";

const DEFAULTS = {
    CALENDAR_SOUND : true,
    CALENDAR_VIBRATION : true,
    CALENDAR_BEFORE : 15,
    CALENDAR_AFTER : 5,
    RADIO_SWIPE : true,
    RADIO_DBLCLICK : false,
    RADIO_VIS : true,
    HOERSPIEL_VIS :true,
    HOERSPIEL_REMOVE : false,
    RADIO_BEFORE: 15,
    RADIO_AFTER : 5,
    CALENDAR_RINGTONE: ""
};

if (!Ti.App.Properties.hasProperty(DEPOT))
    Ti.App.Properties.setString(DEPOT, JSON.stringify(DEFAULTS));

exports.set = (k,v) => {
    var Depot = JSON.parse(Ti.App.Properties.getString(DEPOT, '{}'));
    Depot[k] = v;
    Ti.App.Properties.setString(DEPOT, JSON.stringify(Depot));
};
exports.get = k => {
    const Depot = JSON.parse(Ti.App.Properties.getString(DEPOT, '{}'));
    return Depot[k];
};

exports.styles = {
    left : 10,
    right : 70,
    font : {
        fontSize : 18,
        fontWeight : 'bold',
    },
    color : '#555',
};
