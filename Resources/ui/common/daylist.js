module.exports = function(i) {
    var data = [];
    var self = Ti.UI.createView({

        backgroundColor : '#427aa7'
    });
    self.list = Ti.UI.createTableView({
        data : data,
        bottom : 40,
        backgroundColor : 'white'
    });

    self.add(self.list);
    require('controls/html.adapter')({
        date : (require('vendor/moment'))().add(i, 'd').format('YYYY-MM-DD'),
        onload : function(list) {
            list.forEach(function(item) {
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
            self.list.setData(data);
        }
    });
    var tag = '';
    switch (i) {
        case -1 :
        tag = 'Gestern';
        break;
    case 0 :
        tag = 'Heute';
        break;
    case 1 :
        tag = 'Morgen';
        break;
    case 2:
        tag = 'Übermorgen';
        break;
    default:
        tag = (require('vendor/moment'))().add(i, 'd').format('YYYY-MM-DD');
    }
    self.add(Ti.UI.createLabel({
        height : 40,
        bottom : 0,
        color : 'white',
        font : {
            fontSize : 20,
            fontFamily : 'Rambla-Bold'

        },
        textAlign : 'center',
        text : tag
    }));
    return self;
};
