function ApplicationTabGroup(Window) {
    //create module instance
    var self = Ti.UI.createTabGroup({
        fullscreen : true
    });

    //create app tabs
    var win1 = new Window('Heute, morgen …'),
        win2 = new Window('Suche');

    var tab1 = Ti.UI.createTab({
        title : 'Was läuft?',
       
        window : win1
    });
    win1.containingTab = tab1;

    var tab2 = Ti.UI.createTab({
        title :'Datenbanksuche',
        
        window : win2
    });
    win2.containingTab = tab2;

    self.addTab(tab1);
    self.addTab(tab2);

    return self;
};

module.exports = ApplicationTabGroup;
