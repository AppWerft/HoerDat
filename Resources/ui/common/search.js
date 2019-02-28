module.exports = function(window) {
    function onClickFunc() {
        if (textField.getValue().length < 3) {
            Ti.UI.createNotification({
                message : 'Das Suchwort sollte mindestens drei Zeichen lang sein. '
            }).show();
            return;
        }
        self.darker.show();
        
        var payload = {
            col1 : selectedkey,
            a : textField.getValue() || 'Rauschen',
            so : 'autor',
            soo : 'asc',

        };
        require('controls/htmlpost.adapter')({
            payload : payload,
            onprogress : function(_e) {
                
            },
            onerror : function() {
                Ti.UI.createNotification({
                    message : 'Datenbankserver antwortet zu langsam …\n Einfach nochmals losschicken! '
                }).show();
                self.darker.hide();
              
                return;
            },
            onload : function(_list) {
                var data = [];
                self.darker.hide();
              
                if (_list.length == 0) {
                    Ti.UI.createNotification({
                        message : 'Mehr als 100 Datensätze, formulieren Sie Ihre Anfrage bitte etwas genauer. '
                    }).show();
                    return;
                }
                var win = Ti.UI.createWindow({
                    data : _list,
                    searchItem : payload,
                    backgroundColor : 'white'
                });
                win.open();
                win.list = Ti.UI.createTableView();
                win.add(win.list);
                win.data.forEach(function(item) {
                    data.push(require('ui/common/row.widget')(item));
                });
                win.list.setData(data);
                win.list.addEventListener('click', function(_e) {
                    require('ui/common/sendung.window')(_e.rowData.itemId).open();
                });
                win.addEventListener('open', require('ui/common/search.menu'));

                /*
                 _list.forEach(function(item) {
                 data.push(require('ui/common/row.widget')(item));
                 });
                 self.result.setData(data);*/
            }
        });
    }
    var self = Ti.UI.createView();
    
    self.darker = Ti.UI.createView({
        backgroundColor : 'black',
        opacity : 0.5,
        visible : false,
        zIndex : 900
    });
    window.add(self);
   
    window.add(self.darker);
    

    var selectedkey = 'ti';
    var keyselector = Ti.UI.createView({
        top : 30,
        left : 15,
        height : 20,
        width : 200,
        backgroundColor : '#777'
    });
    keyselector.add(Ti.UI.createImageView({
        image : '/images/d.png',
        width : 10,
        height : 10,
        right : 0,
        bottom : 0
    }));
    var key = Ti.UI.createLabel({
        text : 'Hörspiel-Titel',
        color : 'white',
        left : 5,
        touchEnabled : false,
        width : Ti.UI.FILL,
        textAlign : 'left'
    });
    keyselector.add(key);
    self.add(keyselector);
    var textField = Ti.UI.createTextField({
        borderWidth : 1,
        borderColor : 'silver',
        borderRadius : 5,
        color : '#336699',
        top : 60,
        left : 10,
        hintText : 'Suchbegriff',
        width : '90%',
        height : 40
    });
    self.lupe = Ti.UI.createImageView({
        image : '/images/lupe.png',
        width : 80,
        top : 45,
        bubbleParent : false,
        height : 70,
        right : 5
    });
    self.add(self.lupe);
   
    var StartButton4Search = Ti.UI.createButton({
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        title : 'Datenbankanfrage',
        bottom : 10,
        left : 10,
        width : '90%',
        bubbleParent : false,
        height : 60
    });
    self.add(textField);
    self.add(StartButton4Search);

    var search = {
        titles : ['Hörspieltitel', 'Autor Vorname', 'Autor Nachname', 'Produktion', 'Regie', 'Komposition', 'Übersetzung', 'Beschreibung (Volltext)', 'Mitwirkende'],
        keys : ['ti', 'au.an', 'au.av', 'pr', 're.an', 'ko.an', 'ua.an', 'ko.an', 'ua.an', 'inhv', 'mit']
    };
    Container4Radiostationen = Ti.UI.createView({
        top : 150,
        bubbleParent : false,
        left : 10,
        right : 10,
        height : Ti.UI.SIZE,
        layout : 'horizontal'
    });
    var stations = ['dlr', 'dlf', 'br', 'orf', 'srf', 'hr', 'mdr', 'rbb', 'wdr', 'rb n', 'ndr', 'swr', 'sr', 'dw', 'corax'];
    stations.forEach(function(s) {
        Container4Radiostationen.add(Ti.UI.createImageView({
            top : 5,
            left : 5,
            borderWidth : 1,
            borderColor : '#eee',
            opacity : 1,
            horizontalWrap : true,
            width : 60,
            height : 60,
            image : '/images/' + s + '.png'
        }));
    });
    self.add(Container4Radiostationen);

    Container4Radiostationen.addEventListener('click', function(_e) {
        _e.source.opacity = (_e.source.opacity == 1) ? 0.15 : 1;

    });
   
    keyselector.addEventListener('click', function() {
        var dialog = Ti.UI.createOptionDialog({
            selectedIndex : 0,
            options : search.titles
        });
        dialog.show();
        dialog.addEventListener('click', function(_e) {
            key.setText(_e.source.options[_e.index]);
            selectedkey = search.keys[_e.index];
        });
    });
    StartButton4Search.addEventListener('click', onClickFunc);
    self.lupe.addEventListener('click', onClickFunc);

};
