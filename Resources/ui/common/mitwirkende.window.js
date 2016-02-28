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

module.exports = function(data) {
    var self = Ti.UI.createWindow({
        title : data.title.trim(),
        backgroundColor : 'white',
        fullscreen : false,
        data : data
    });
    self.container = Ti.UI.createScrollView({
        scrollType : 'vertical',
        layout : 'vertical',
        left : 10,
        right : 10,
    });
    data.mitwirkende.forEach(function(p){
        self.container.add(getMeta(p.role, p.person));
    }
        
    );
    self.add(self.container);
    self.addEventListener('open', require('ui/common/mitwirkende.menu'));
    return self;
};
