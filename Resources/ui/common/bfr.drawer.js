const Wecker = require('controls/alarms'),
    Moment = require("vendor/moment"),
    Adapter = require('controls/bfr.adapter');

module.exports = function(toggleDrawer,startSearch,startFilter) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    const $ = Ti.UI.createView({
        layout : 'vertical',
        height : Ti.UI.FILL
    });
    $.add(require("ui/common/headerview.widget")('Suche im Freies Radio Net'));
    $.searchRow = Ti.UI.createView({
        top : 0,
        backgroundColor : '#225588',
        height : 50
    });
    $.searchRow.add(Ti.UI.Android.createSearchView({
        color : '#fff',
        hintText : "Suche …"
    }));
    $.searchRow.children[0].addEventListener("submit", e => {
        toggleDrawer && toggleDrawer();
        startSearch && startSearch(e.source.value);
    });
    $.add($.searchRow);
    $.add(require("ui/common/headerview.widget")('Sendungen der Radiostationen'));
    $.radioList = Ti.UI.createListView({
        backgroundColor : 'white',
        templates : {
            'freiradio' : require('TEMPLATES').freiradio
        },
        defaultItemTemplate : 'freiradio',
        sections : [Ti.UI.createListSection()]
    });
    $.add($.radioList);
    Adapter.getAllRadios(radios => {
        $.radioList.sections[0].items = radios.map(function(item) {
           return {
                properties : {
                    itemId : JSON.stringify(item),
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
                },
                name : {
                    text : item.name
                },
                icon: {backgroundImage: item.icon}
            };
         });
    });
    $.radioList.addEventListener("itemclick",e => {
         toggleDrawer && toggleDrawer();
         console.log(e.itemId);
         startFilter && startFilter(JSON.parse(e.itemId).id);
    });
    return $;
};
