var Moment = require('vendor/moment');
Moment.locale('de');

function getMeta(key, value) {
    var self = Ti.UI.createView({
        height : Ti.UI.SIZE,
        top : 5
    });
    self.add(Ti.UI.createLabel({
        left : 0,
        text : key,
        color : '#333',

        font : {
            fontSize : 9
        },
        width : 80
    }));
    self.add(Ti.UI.createLabel({
        left : 80,
        width : Ti.UI.FILL,
        textAlign : 'left',
        font : {
            fontSize : 20,
            fontFamily : 'Rambla-Bold'
        },
        text : value,
        top : 0,
        color : '#444',
    }));
    return self;
};

module.exports = function(item) {
    var self = Ti.UI.createWindow({
        title : item.title.trim(),
        backgroundColor : 'white',
        fullscreen : false,
       
        data : item
    });
    self.container = Ti.UI.createScrollView({
        scrollType : 'vertical',
        layout : 'vertical',
        left : 10,
        right : 10,
    });

    item.time && self.container.add(getMeta('Beginn', Moment(item.time_isostring).format('dddd  HH:mm') + ' Uhr'));
    item.station && self.container.add(getMeta('Station', item.station));

    self.container.add(getMeta('Autor(en)', item.autor));
    self.container.add(getMeta('Regisseur(e)', item.regisseure));
    self.container.add(getMeta('Produktion', item.produktion));
    item.komponisten && self.container.add(getMeta('Komponist(en)', item.komponisten));
    item.uebersetzer && self.container.add(getMeta('Übersetzer', item.uebersetzer));

    item.inhalt && self.container.add(Ti.UI.createLabel({
        text : item.inhalt.replace(/[\s]{3,}/gm, '\n\n'),
        top : 10,
        height : Ti.UI.SIZE,
        color : '#427aa7',
        width : Ti.UI.FILL,
        textAlign : 'left',
        font : {
            fontSize : 16,
            fontFamily : 'DroidSans',

        }
    }));
    self.add(self.container);
    self.addEventListener('open', require('ui/common/sendung.menu'));
    return self;
};
