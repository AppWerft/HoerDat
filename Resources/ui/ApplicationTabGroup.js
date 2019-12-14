const tabData = require('model/tabgroup');
const RadioPlayer = require("ui/common/radioplayer.window");
const onOpen = require('ui/main.menu');  
  
module.exports = function() {
    const $ = Ti.UI.createTabGroup({
        fullscreen : false,
        exitOnClose : true,
        tabsBackgroundColor : '#88225588',
        swipeable : false,
        barColor : 'white',
        smoothScrollOnTabClick : true,
        sustainedPerformanceMode : true,
        tabsBackgroundSelectedColor : '#883377aa',
        style : Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION,
        orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
        theme: 'Theme.Tabgroup'
    });
    function playRadio(intent) {
         if (intent && intent.action == 'START_RADIO') {
        if (intent.hasExtra("extradata")) {
                const sender = JSON.parse(intent.getStringExtra("extradata"));
                RadioPlayer($, sender, null).open();
            } else console.log("Extradata are missing");
        }
    }
    $.addEventListener('close', function() {
        Ti.App.fireEvent('stopRadio');
    });
    $.addEventListener('open', function(open) {
        onOpen(open);
    });
    // $.addEventListener('focus', require('ui/common/tabgroup.onfocus'));
    $.open();

    /* Filling tabgroup with tabs */
    tabData.forEach( d => {
        $.addTab(Ti.UI.createTab({
            title : d.title,
            icon : d.icon,
            window : require(d.window)($)
        }));
    });
   
    Ti.Android.currentActivity.addEventListener('newintent', function(e) {
        console.log(">>> from notification on running app");
        playRadio(e.intent);
    });
    $.addEventListener('open', function(e) {
        console.log(">>> from notification on sleeping app ");
        if (e.source.activity) playRadio(Ti.Android.currentActivity.getIntent());
    });
 
    /* Restoring latest state */
    const activeTabIndex = Ti.App.Properties.getInt("ACTIVE_TAB", 1);
    $.setActiveTab(activeTabIndex);

    /* Persisting new state (later, if all UI work is ready) */
    setTimeout(function() {
        $.addEventListener('focus', function(focus) {
            // for preventing of stuttering during movement_
            setTimeout(function() {
                Ti.App.Properties.setInt('ACTIVE_TAB', focus.index);
            }, 1000);
        });
    }, 1500);
};
