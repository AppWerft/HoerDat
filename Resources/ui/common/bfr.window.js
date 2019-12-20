const Adapter = require('controls/bfr.adapter');
const FilterButton = require("ui/common/filterbutton.widget");

module.exports = function() {
    function renderDefaultContent(forced, onEndrefresh) {
        Adapter.getLatest(forced,items => {
            // Rerendering only if model changed:
            if (Ti.Utils.md5HexDigest(JSON.stringify(items)) != $.DrawerLayout.centerView.md5)
                $.DrawerLayout.centerView.data = items.map(require('ui/common/bfr.row'));
            $.DrawerLayout.centerView.md5 = Ti.Utils.md5HexDigest(JSON.stringify(items));
            // onEndrefresh && onEndrefresh();
        });
    }

    // Adapter.getSearchList("Jena",function(){});
    const $ = Ti.UI.createWindow({
        backgroundImage : '/images/bg.png'
    });

    $.addEventListener('open', () => {
        if ($.children && $.children.length)
            return;
        $.DrawerLayout = Ti.UI.Android.createDrawerLayout({
            leftView : require('ui/common/bfr.drawer')(), //
            centerView : Ti.UI.createTableView({
                backgroundColor : '#aaffffff',
                refreshControl : Ti.UI.createRefreshControl({
                    tintColor : '#225588'
                }),
            })
        });
        $.DrawerLayout.centerView.addEventListener("click", e => {
            require('ui/common/bfrplayer.window')(JSON.parse(e.row.itemId)).open();
        });
        $.DrawerLayout.centerView.refreshControl.addEventListener('refreshstart', function(e) {
            renderDefaultContent(true);
            $.DrawerLayout.centerView.refreshControl.endRefreshing();
        });
        $.add($.DrawerLayout);
        renderDefaultContent(false);
        $.filterButton = FilterButton({
            onShow : function() {
                $.DrawerLayout.toggleLeft();
            },
            onHide : function() {
                console.log("hide Search");
            }
        });
        $.filterButton.bottom = 26;
        $.filterButton.zIndex = 99;
  
        $.add($.filterButton);
    });
    return $;
};
