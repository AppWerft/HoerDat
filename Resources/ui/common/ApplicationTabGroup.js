

module.exports = function (Window) {
    //create module instance
    var self = Ti.UI.createTabGroup({
        fullscreen : true
    });

    var win1 = new Window('Heute, morgen …');
    require('ui/common/scheduler')(win1);

    var win2 = new Window('Suche');
    require('ui/common/search')(win2);

    var tab1 = Ti.UI.createTab({
        title : 'Im Radio',
        window : win1
    });
    var tab2 = Ti.UI.createTab({
        title : 'Suche',
        window : win2
    });
    self.addTab(tab1);
    self.addTab(tab2);
    require('vendor/versionsreminder')();
    return self;
};

