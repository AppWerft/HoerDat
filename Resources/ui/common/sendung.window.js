function getMeta(key, value) {
    var self = Ti.UI.createView({
        height : Ti.UI.SIZE,
        top : 5
    });
    self.add(Ti.UI.createLabel({
        left : 0,
        text : key,top:0,
        width : '35%'
    }));
    self.add(Ti.UI.createLabel({
        left : '36%',
        width : Ti.UI.FILL,
        textAlign : 'left',
        text : value,top:0,
        color : '#444',
    }));
    return self;

};

module.exports = function(item) {
    var self = Ti.UI.createWindow({
        title : item.title,
        backgroundColor : 'white',
        fullscreen : true,
        data : item
    });
    self.container = Ti.UI.createScrollView({
        scrollType : 'vertical',
        layout : 'vertical',
        left : 10,
        right : 10,
    });
    self.container.add(getMeta('Autoren', item.autor));
    self.container.add(getMeta('Regisseure', item.regisseure));
    self.container.add(getMeta('Produktion', item.produktion));
    item.komponisten && self.container.add(getMeta('Komponisten', item.komponisten));
    item.uebersetzer && self.container.add(getMeta('Übersetzer', item.uebersetzer));

    self.container.add(Ti.UI.createLabel({
        text : item.inhalt.replace(/[\s]{3,}/gm, '\n\n'),
        top : 5,
        height : Ti.UI.SIZE,
        color : '#427aa7',
        font : {
            fontSize : 16,
            fontFamily : 'DroidSans',

        }
    }));
    self.add(self.container);
    self.addEventListener('open', require('ui/common/sendung.menu'));
    return self;
};
