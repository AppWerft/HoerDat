module.exports = function(window) {
    var self = Ti.UI.createScrollableView({
        scrollingEnabled : false
    });
    self.circleProgress = require('vendor/circularprogress')({
        percent : 0,
        size : 250,
        margin : 1,
        backgroundColor : '#fff',
        progressColor : '#427aa7',
        topper : {
            color : '#fff',
            size : 245
        },
        font : {
            visible : false
        }
    });
    window.add(self.circleProgress);
    var selectedkey = 'ti';
    self.form = Ti.UI.createView();
    self.result = Ti.UI.createTableView();
    self.setViews([self.form, self.result]);
    window.add(self);
    var keyselector = Ti.UI.createView({
        top : 20,
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
    self.form.add(keyselector);
    var textField = Ti.UI.createTextField({
        borderWidth : 1,
        borderColor : 'silver',
        borderRadius : 5,
        color : '#336699',
        top : 50,
        left : 10,
        hintText : 'Suchbegriff',
        width : '90%',
        height : 50
    });
    self.form.add(Ti.UI.createImageView({
        image : '/images/lupe.png',
        width : 35,
        top : 60,
        height : 30,
        right : 30
    }));
    var kk = Ti.UI.createImageView({
        image : '/images/kk.png',
        width : 50,
        top : 5,
        height : 40,
        right : 15,
        opacity : 0.3
    });
    self.form.add(kk);
    var Button = Ti.UI.createButton({
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        title : 'Datenbankanfrage',
        bottom : 10,
        left : 10,
        width : '90%',
        bubbleParent : false,
        height : 60
    });
    self.form.add(textField);
    self.form.add(Button);

    var search = {
        titles : ['Hörspieltitel', 'Autor Vorname', 'Autor Nachname', 'Produktion', 'Jahr', 'Regie', 'Bearbeitung', 'Komposition', 'Übersetzung', 'Beschreibung (Volltext)', 'Mitwirkende'],
        keys : ['ti', 'au.an', 'au.av', 'pr', 'yr', 're.an', 'be.an', 'ko.an', 'ua.an', 'ko.an', 'ua.an', 'inhv', 'mit']
    };
    var container = Ti.UI.createView({
        top : 150,
        bubbleParent : false,
        left : 10,
        right : 10,
        height : Ti.UI.SIZE,
        layout : 'horizontal'
    });
    var stations = ['dlr', 'dlf', 'br', 'orf', 'srf', 'hr', 'mdr', 'rbb', 'rb n', 'ndr', 'swr', 'sr', 'corax'];
    stations.forEach(function(s) {
        container.add(Ti.UI.createImageView({
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
    self.form.add(container);

    window.addEventListener('open', function() {
        textField.focus();
    });
    container.addEventListener('click', function(_e) {
        _e.source.opacity = (_e.source.opacity == 1) ? 0.15 : 1;

    });
    kk.addEventListener('click', function(_e) {
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
    Button.addEventListener('click', function() {
        self.scrollingEnabled = true;
        self.scrollToView(1);
        self.result.setData([]);

        self.circleProgress.show();
        require('controls/htmlpost.adapter')({
            payload : {
                col1 : selectedkey,
                a : textField.getValue() || 'Rauschen',
                /*  bool1 : 'and',
                 col2 : 'au.an',
                 bool2 : 'and',
                 col3 : 'au.av',
                 bool8 : 'and',
                 bool4 : 'and',
                 bool5 : 'and',
                 bool7 : 'and',*/
                so : 'autor',
                soo : 'asc',
               
            },
            onprogress : function(_e) {
                console.log(_e);
                self.circleProgress.setValue(_e);
            },
            onload : function(_list) {
                var data = [];
                self.circleProgress.hide();
                if (_list.length == 0) {
                    Ti.UI.createNotification({
                        message : 'Mehr als 100 Datensätze, formulieren Sie Ihre Anfrage bitte etwas genauer. '
                    }).show();
                    self.scrollingEnabled = false;
                    self.scrollToView(0);
                    return;
                }
                _list.forEach(function(item) {
                    var row = Ti.UI.createTableViewRow({
                        height : Ti.UI.SIZE,
                        hasDetail : true,
                        layout : 'vertical'
                    });
                    if (!item.subtitle)
                        row.add(Ti.UI.createLabel({
                            text : item.title,
                            left : 10,
                            top : 8,
                            bottom : 8,
                            right : 10,
                            height : Ti.UI.SIZE,
                            color : '#444',
                            font : {
                                fontSize : 24,
                                fontFamily : 'Rambla-Bold',
                                fontWeight : 'bold'
                            }
                        }));
                    else {
                        row.add(Ti.UI.createLabel({
                            text : item.title,
                            left : 10,
                            top : 8,
                            bottom : 3,
                            right : 10,
                            height : Ti.UI.SIZE,
                            color : '#444',
                            font : {
                                fontSize : 14,
                                fontFamily : 'Rambla-Bold',
                                fontWeight : 'bold'
                            }
                        }));
                        row.add(Ti.UI.createLabel({
                            text : item.subtitle,
                            left : 10,
                            top : 0,
                            bottom : 8,
                            right : 10,
                            height : Ti.UI.SIZE,
                            color : '#444',
                            font : {
                                fontSize : 24,
                                fontFamily : 'Rambla-Bold',
                                fontWeight : 'bold'
                            }
                        }));

                    }
                    data.push(row);
                });
                self.result.setData(data);
            }
        });
    });

};
