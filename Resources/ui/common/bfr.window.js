const FlipModule = require('de.manumaticx.androidflip');

module.exports = function(_tabgroup) {
    function renderDefaultContent(forced, onReady) {
        require('controls/bfr.adapter').getLatest(forced,items => {
            $.DrawerLayout.centerView.data = items.map(require('ui/common/bfr.row'));
            onReady && onReady();
        });
    }
    function renderFilterContent(id) {
        require('controls/bfr.adapter').getFilteredList(id,items => {
            $.DrawerLayout.centerView.data = items.map(require('ui/common/bfr.row'));
        });
    }
    function renderSearchContent(needle) {
        require('controls/bfr.adapter').getSearchList(needle,items => {
            $.DrawerLayout.centerView.data = items.map(require('ui/common/bfr.row'));
        });
    }

    const $ = Ti.UI.createWindow({
        backgroundImage : '/images/bg.png'
    });
    console.log("bfr rendered");
    $.addEventListener('open', () => {
        if ($.children && $.children.length)
            return;
        $.DrawerLayout = Ti.UI.Android.createDrawerLayout({
            leftView : require('ui/common/bfr.drawer')(/*toggleDrawer*/ () => $.DrawerLayout.toggleLeft(),//
                                                       /*startSearch*/  renderSearchContent,//
                                                       /*startFilter*/ renderFilterContent),
            centerView : Ti.UI.createTableView({
                backgroundColor : '#aaffffff',
                refreshControl : Ti.UI.createRefreshControl({
                    tintColor : '#225588'
                }),
            })
        });
        $.DrawerLayout.centerView.addEventListener("click", e => {
            require('ui/common/bfrplayer.window')(_tabgroup, JSON.parse(e.row.itemId)).open();

        });
        $.DrawerLayout.centerView.refreshControl.addEventListener('refreshstart', function(e) {
            renderDefaultContent(true, function() {
                Ti.API.info('refreshstart on Ready');
                $.DrawerLayout.centerView.refreshControl.endRefreshing();
            });
        });
        $.add($.DrawerLayout);
        renderDefaultContent(false);
    });
    return $;
};
